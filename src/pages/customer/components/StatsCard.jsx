export default function StatsCard({ title, value, icon, isLoading = false }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
      <div className="text-3xl sm:text-4xl">{icon}</div>

      <div>
        <h3 className="text-gray-600 text-xs sm:text-sm font-semibold">
          {title}
        </h3>
        {isLoading ? (
          <div className="flex items-center gap-2 text-primary">
            <span className="loading loading-spinner loading-xs" />
            <span className="text-sm">Loading</span>
          </div>
        ) : (
          <p className="text-xl sm:text-2xl font-bold text-primary">{value}</p>
        )}
      </div>
    </div>
  );
}
