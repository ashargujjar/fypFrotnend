export default function RouteTypeBadge({ isIntercityRoute }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isIntercityRoute
          ? "bg-amber-100 text-amber-800"
          : "bg-emerald-100 text-emerald-800"
      }`}
    >
      {isIntercityRoute ? "Linehaul" : "In-city"}
    </span>
  );
}
