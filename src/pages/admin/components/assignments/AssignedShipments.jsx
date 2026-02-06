import RouteTypeBadge from "./RouteTypeBadge";
import {
  buildRouteLabel,
  formatDateTime,
  formatId,
  getRiderForStage,
  isIntercity,
} from "./assignmentUtils";

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    if (value.$oid) return String(value.$oid).trim();
    if (value._id) return normalizeId(value._id);
    if (value.id) return normalizeId(value.id);
  }
  return String(value).trim();
};

const normalizeValue = (value) => String(value || "").trim().toLowerCase();
const normalizeKey = (value) => normalizeId(value).toLowerCase();

const RIDER_ID_FIELDS = {
  pickup: [
    "pickupRiderId",
    "pickup_rider_id",
    "pickupRiderID",
    "riderId",
    "rider_id",
  ],
  linehaul: [
    "linehaulRiderId",
    "linehaul_rider_id",
    "linehaulRiderID",
    "intercityRiderId",
    "hubRiderId",
    "hub_rider_id",
  ],
  delivery: [
    "deliveryRiderId",
    "delivery_rider_id",
    "deliveryRiderID",
    "dropoffRiderId",
    "dropoff_rider_id",
  ],
};

const getRiderIdForStage = (shipment, stage) => {
  if (!shipment || !stage) return "";
  const fields = RIDER_ID_FIELDS[stage] || [];
  for (const field of fields) {
    const value = normalizeId(shipment?.[field]);
    if (value) return value;
  }
  return "";
};

const formatCategory = (value) => {
  const normalized = normalizeValue(value);
  if (!normalized) return "-";
  if (normalized === "linehaul") return "Linehaul Rider";
  if (normalized === "pickup") return "Pickup Rider";
  if (normalized === "delivery") return "Delivery Rider";
  return value;
};

export default function AssignedShipments({
  sectionRef,
  assignedCount,
  shipments,
  riders,
  riderTasks,
  isLoading,
  loadError,
  assignmentStage,
}) {
  const ridersList = Array.isArray(riders) ? riders : [];
  const tasksList = Array.isArray(riderTasks) ? riderTasks : [];
  const riderLookup = new Map();
  ridersList.forEach((rider) => {
    const nameKey = normalizeValue(rider?.name);
    const idKey = normalizeKey(rider?.id || rider?._id);
    if (nameKey) riderLookup.set(nameKey, rider);
    if (idKey) riderLookup.set(idKey, rider);
  });
  const taskLookup = new Map();
  tasksList.forEach((task) => {
    const shipmentId = normalizeId(task?.shipmentId || task?.shipment);
    const riderId = normalizeId(task?.riderId || task?.rider || task?.assignedRiderId);
    if (!shipmentId || !riderId) return;
    const key = normalizeKey(shipmentId);
    const assignedTime = new Date(
      task?.assignedTime || task?.updatedAt || task?.createdAt || 0,
    ).getTime();
    const existing = taskLookup.get(key);
    if (!existing || assignedTime > existing.assignedTime) {
      taskLookup.set(key, { riderId, assignedTime });
    }
  });

  return (
    <div
      ref={sectionRef}
      className="customer-card bg-white p-6 rounded-xl shadow overflow-x-auto"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-primary">
            Assigned Orders
          </h2>
          <p className="text-sm text-gray-500">
            Orders with riders assigned and ready to dispatch.
          </p>
        </div>
        <div className="bg-white border rounded-full shadow px-3 py-1 text-sm text-gray-600">
          Total Assigned:{" "}
          {isLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            assignedCount
          )}
        </div>
      </div>

      <table className="w-full text-left min-w-[980px]">
        <thead>
          <tr className="bg-gray-50 border-b text-gray-600 text-sm">
            <th className="p-3 font-semibold">Shipment ID</th>
            <th className="p-3 font-semibold">Customer ID</th>
            <th className="p-3 font-semibold">Route</th>
            <th className="p-3 font-semibold">Route Type</th>
            <th className="p-3 font-semibold">Rider Name</th>
            <th className="p-3 font-semibold">Rider Phone</th>
            <th className="p-3 font-semibold">Rider Category</th>
            <th className="p-3 font-semibold">Time Window</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td className="p-6 text-center text-gray-500" colSpan={8}>
                <div className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Loading shipments...
                </div>
              </td>
            </tr>
          ) : loadError ? (
            <tr>
              <td className="p-6 text-center text-red-600" colSpan={8}>
                {loadError}
              </td>
            </tr>
          ) : shipments.length ? (
            shipments.map((shipment) => {
              const intercity = isIntercity(shipment);
              const route = buildRouteLabel(shipment);
              const stageRider = getRiderForStage(shipment, assignmentStage);
              const stageRiderId = getRiderIdForStage(
                shipment,
                assignmentStage,
              );
              const taskRiderId =
                taskLookup.get(normalizeKey(shipment?._id))?.riderId || "";
              const riderDetails =
                (stageRider && riderLookup.get(normalizeValue(stageRider))) ||
                (stageRiderId && riderLookup.get(normalizeKey(stageRiderId))) ||
                (taskRiderId && riderLookup.get(normalizeKey(taskRiderId))) ||
                (stageRider && riderLookup.get(normalizeKey(stageRider))) ||
                null;
              const riderName = riderDetails?.name || stageRider || "-";
              const riderPhone = riderDetails?.phone || "-";
              const riderCategory = riderDetails?.category
                ? formatCategory(riderDetails.category)
                : "-";

              return (
                <tr key={shipment._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold" title={shipment._id}>
                    {formatId(shipment._id)}
                  </td>
                  <td className="p-3" title={shipment.userId}>
                    {formatId(shipment.userId)}
                  </td>
                  <td className="p-3 text-sm text-gray-700">{route}</td>
                  <td className="p-3 text-sm">
                    <RouteTypeBadge isIntercityRoute={intercity} />
                  </td>
                  <td className="p-3">{riderName}</td>
                  <td className="p-3">{riderPhone}</td>
                  <td className="p-3">{riderCategory}</td>
                  <td className="p-3 text-sm text-gray-700">
                    {formatDateTime(shipment.createdAt)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="p-6 text-center text-gray-500" colSpan={8}>
                No assigned shipments yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
