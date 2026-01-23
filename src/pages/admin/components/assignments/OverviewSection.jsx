import OverviewCard from "./OverviewCard";

export default function OverviewSection({
  isLoading,
  unassignedCount,
  intercityCount,
  intracityCount,
  stageLabel,
}) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <OverviewCard
        label={`Ready To Dispatch (${stageLabel})`}
        value={unassignedCount}
        accent="text-red-600 bg-red-50"
        isLoading={isLoading}
      />
      <OverviewCard
        label="Linehaul / Hub Transfer"
        value={intercityCount}
        accent="text-amber-600 bg-amber-50"
        isLoading={isLoading}
      />
      <OverviewCard
        label="In-City Assignments"
        value={intracityCount}
        accent="text-blue-600 bg-blue-50"
        isLoading={isLoading}
      />
    </div>
  );
}
