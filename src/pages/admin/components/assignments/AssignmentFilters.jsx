export default function AssignmentFilters({
  assignmentStage,
  routeFilter,
  onChangeAssignmentStage,
  onChangeRouteFilter,
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
          value={routeFilter}
          onChange={(e) => onChangeRouteFilter(e.target.value)}
          className="bg-transparent text-sm focus:outline-none"
        >
          <option value="all">All Routes</option>
          <option value="intracity">In-city</option>
          <option value="intercity">Intercity / Linehaul</option>
        </select>
      </div>
    </div>
  );
}
