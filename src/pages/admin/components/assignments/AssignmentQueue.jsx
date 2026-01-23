import AssignmentFilters from "./AssignmentFilters";
import RouteTypeBadge from "./RouteTypeBadge";
import {
  formatArea,
  formatDateTime,
  formatId,
  getRiderForStage,
  isAssigned,
  isIntercity,
} from "./assignmentUtils";

export default function AssignmentQueue({
  assignmentStage,
  assignmentFilter,
  routeFilter,
  sortBy,
  stageLabel,
  onChangeAssignmentStage,
  onChangeAssignmentFilter,
  onChangeRouteFilter,
  onChangeSortBy,
  shipments,
  isLoading,
  loadError,
  riders,
  selectedRiders,
  assigningMap,
  onSelectRider,
  onAssign,
}) {
  const stageKey = String(assignmentStage || "").toLowerCase();
  const categoryKey =
    stageKey === "pickup" || stageKey === "linehaul" || stageKey === "delivery"
      ? stageKey
      : "";
  const assignLabel = stageLabel ? `${stageLabel} Rider` : "Rider";
  const stageHeading =
    stageKey === "pickup"
      ? "Shipments to Pick Up"
      : stageKey === "linehaul"
        ? "Shipments for Linehaul Transfer"
        : stageKey === "delivery"
          ? "Shipments to Drop Off"
          : "Assignment Queue";
  const stageDescription =
    stageKey === "pickup"
      ? "Assign a pickup rider for customer collection."
      : stageKey === "linehaul"
        ? "Assign a linehaul rider for hub-to-hub moves."
        : stageKey === "delivery"
          ? "Assign a delivery rider for final-mile drop-off."
          : "Shipments awaiting assignment.";
  const ridersList = Array.isArray(riders) ? riders : [];
  const hasCategories = ridersList.some((rider) =>
    String(rider?.category || "").trim(),
  );
  const availableRiders =
    categoryKey && hasCategories
      ? ridersList.filter(
          (rider) =>
            String(rider?.category || "").toLowerCase() === categoryKey,
        )
      : ridersList;
  const showNoStageRiders =
    categoryKey && hasCategories && ridersList.length && !availableRiders.length;
  const normalizeValue = (value) => String(value || "").trim().toLowerCase();
  const matchesArea = (rider, city, zone) => {
    const riderCity = normalizeValue(rider?.city);
    const riderZone = normalizeValue(rider?.zone);
    const targetCity = normalizeValue(city);
    const targetZone = normalizeValue(zone);
    if (targetCity && riderCity && riderCity !== targetCity) return false;
    if (targetZone && riderZone && riderZone !== targetZone) return false;
    return true;
  };

  return (
    <div className="customer-card bg-white p-6 rounded-xl shadow overflow-x-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-primary">
            {stageHeading}
          </h2>
          <p className="text-sm text-gray-500">{stageDescription}</p>
        </div>
        <AssignmentFilters
          assignmentStage={assignmentStage}
          assignmentFilter={assignmentFilter}
          routeFilter={routeFilter}
          sortBy={sortBy}
          onChangeAssignmentStage={onChangeAssignmentStage}
          onChangeAssignmentFilter={onChangeAssignmentFilter}
          onChangeRouteFilter={onChangeRouteFilter}
          onChangeSortBy={onChangeSortBy}
        />
      </div>
      {showNoStageRiders && (
        <p className="text-xs text-amber-600 mb-3">
          No {assignLabel.toLowerCase()} found. Add riders with category "
          {stageKey}".
        </p>
      )}

      <table className="w-full text-left min-w-[820px]">
        <thead>
          <tr className="bg-gray-50 border-b text-gray-600 text-sm">
            <th className="p-3 font-semibold">Shipment ID</th>
            <th className="p-3 font-semibold">Customer ID</th>
            <th className="p-3 font-semibold">Pickup</th>
            <th className="p-3 font-semibold">Drop-off</th>
            <th className="p-3 font-semibold">Route Type</th>
            <th className="p-3 font-semibold">Time Window</th>
            <th className="p-3 font-semibold">
              Assign {assignLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td className="p-6 text-center text-gray-500" colSpan={7}>
                <div className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Loading shipments...
                </div>
              </td>
            </tr>
          ) : loadError ? (
            <tr>
              <td className="p-6 text-center text-red-600" colSpan={7}>
                {loadError}
              </td>
            </tr>
          ) : shipments.length ? (
            shipments.map((shipment) => {
              const intercity = isIntercity(shipment);
              const assigned = isAssigned(shipment, assignmentStage);
              const stageRider = getRiderForStage(shipment, assignmentStage);
              const selectedStageRider =
                selectedRiders[shipment._id]?.[assignmentStage] ?? "";
              const assignKey = `${shipment._id}:${assignmentStage}`;
              const isAssigning = Boolean(assigningMap?.[assignKey]);
              const stageRiders =
                stageKey === "pickup"
                  ? availableRiders.filter((rider) =>
                      matchesArea(
                        rider,
                        shipment.pickupCity,
                        shipment.pickupZone,
                      ),
                    )
                  : stageKey === "delivery"
                    ? availableRiders.filter((rider) =>
                        matchesArea(
                          rider,
                          shipment.deliveryCity,
                          shipment.deliveryZone,
                        ),
                      )
                    : availableRiders;

              return (
                <tr key={shipment._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-semibold" title={shipment._id}>
                      {formatId(shipment._id)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {assigned ? "Assigned" : "Unassigned"}
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold" title={shipment.userId}>
                      {formatId(shipment.userId)}
                    </p>
                    <p className="text-xs text-gray-500">Standard</p>
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {formatArea(shipment.pickupCity, shipment.pickupZone)}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {formatArea(shipment.deliveryCity, shipment.deliveryZone)}
                  </td>
                  <td className="p-3 text-sm">
                    <RouteTypeBadge isIntercityRoute={intercity} />
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {formatDateTime(shipment.createdAt)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedStageRider || stageRider || ""}
                        onChange={(e) =>
                          onSelectRider(
                            shipment._id,
                            assignmentStage,
                            e.target.value,
                          )
                        }
                        className="border rounded-lg px-3 py-2 text-sm w-44"
                        disabled={isAssigning}
                      >
                        <option value="">Select Rider</option>
                        {stageRiders.length ? (
                          stageRiders.map((rider) => (
                            <option key={rider.id} value={rider.name}>
                              {rider.name} - {rider.zone}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No rider found in this area
                          </option>
                        )}
                      </select>
                      <button
                        onClick={() => onAssign(shipment._id, assignmentStage)}
                        className="customer-button bg-primary text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedStageRider || isAssigning}
                      >
                        {isAssigning ? (
                          <span className="flex items-center gap-2">
                            <span className="loading loading-spinner loading-sm" />
                            Assigning
                          </span>
                        ) : (
                          "Assign"
                        )}
                      </button>
                    </div>
                    {stageRider && (
                      <p className="text-xs text-gray-500 mt-1">
                        Currently: {stageRider}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="p-6 text-center text-gray-500" colSpan={7}>
                No shipments match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
