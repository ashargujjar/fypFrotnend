export default function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4">
      <div className="text-3xl sm:text-4xl">{icon}</div>

      <div>
        <h3 className="text-gray-600 text-xs sm:text-sm font-semibold">
          {title}
        </h3>
        <p className="text-xl sm:text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}
