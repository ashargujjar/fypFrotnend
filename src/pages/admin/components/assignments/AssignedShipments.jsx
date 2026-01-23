import RouteTypeBadge from "./RouteTypeBadge";
import {
  buildRouteLabel,
  formatDateTime,
  formatId,
  getAssignedRiders,
  getStageLabel,
  isIntercity,
} from "./assignmentUtils";

export default function AssignedShipments({
  sectionRef,
  assignedCount,
  shipments,
  isLoading,
  loadError,
  assignmentStage,
}) {
  const stageLabel = getStageLabel(assignmentStage);

  return (
    <div
      ref={sectionRef}
      className="customer-card bg-white p-6 rounded-xl shadow overflow-x-auto"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-primary">
            Assigned {stageLabel} Orders
          </h2>
          <p className="text-sm text-gray-500">
            Orders with {stageLabel.toLowerCase()} riders assigned and ready to dispatch.
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
            <th className="p-3 font-semibold">Pickup Rider</th>
            <th className="p-3 font-semibold">Linehaul Rider</th>
            <th className="p-3 font-semibold">Delivery Rider</th>
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
              const riders = getAssignedRiders(shipment);

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
                  <td className="p-3">{riders.pickup || "-"}</td>
                  <td className="p-3">
                    {intercity ? riders.linehaul || "-" : "-"}
                  </td>
                  <td className="p-3">{riders.delivery || "-"}</td>
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
