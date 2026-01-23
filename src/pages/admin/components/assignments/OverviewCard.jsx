export default function OverviewCard({ label, value, accent, isLoading }) {
  return (
    <div className="customer-card customer-card-elevate bg-white rounded-xl shadow p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-2xl font-bold ${accent}`}>
          {isLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            value
          )}
        </p>
      </div>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${accent}`}
      >
        i
      </div>
    </div>
  );
}
