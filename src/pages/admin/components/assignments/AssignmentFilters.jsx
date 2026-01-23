export default function AssignmentFilters({
  assignmentStage,
  assignmentFilter,
  routeFilter,
  sortBy,
  onChangeAssignmentStage,
  onChangeAssignmentFilter,
  onChangeRouteFilter,
  onChangeSortBy,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <p className="text-sm text-gray-600">
        Select a stage to see shipments for pickup or drop-off.
      </p>
      <div className="bg-white border rounded-full shadow px-2 py-1">
        <select
          value={assignmentStage}
          onChange={(e) => onChangeAssignmentStage(e.target.value)}
          className="bg-transparent text-sm focus:outline-none"
        >
          <option value="pickup">Pickup</option>
          <option value="linehaul">Linehaul</option>
          <option value="delivery">Delivery</option>
        </select>
      </div>
      <div className="bg-white border rounded-full shadow px-2 py-1">
        <select
          value={assignmentFilter}
          onChange={(e) => onChangeAssignmentFilter(e.target.value)}
          className="bg-transparent text-sm focus:outline-none"
        >
          <option value="all">All</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>
      <div className="bg-white border rounded-full shadow px-2 py-1">
        <select
          value={routeFilter}
          onChange={(e) => onChangeRouteFilter(e.target.value)}
          className="bg-transparent text-sm focus:outline-none"
        >
          <option value="all">All Routes</option>
          <option value="intracity">In-city</option>
          <option value="intercity">Intercity / Linehaul</option>
        </select>
      </div>
      <div className="bg-white border rounded-full shadow px-2 py-1">
        <select
          value={sortBy}
          onChange={(e) => onChangeSortBy(e.target.value)}
          className="bg-transparent text-sm focus:outline-none"
        >
          <option value="assigned-first">Assigned First</option>
          <option value="unassigned-first">Unassigned First</option>
          <option value="order">Shipment ID</option>
        </select>
      </div>
    </div>
  );
}
