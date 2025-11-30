export default function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
      <div className="text-4xl">{icon}</div>

      <div>
        <h3 className="text-gray-600 text-sm font-semibold">{title}</h3>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}
