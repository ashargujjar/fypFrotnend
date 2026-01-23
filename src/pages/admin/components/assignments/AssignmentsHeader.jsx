import { getStageLabel } from "./assignmentUtils";

export default function AssignmentsHeader({
  isLoading,
  unassignedCount,
  assignmentStage,
}) {
  const stageLabel = getStageLabel(assignmentStage);

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          Assignment Management
        </h1>
        <p className="text-gray-600">
          Assign pickup, linehaul, and delivery riders by stage.
        </p>
      </div>
      <div className="customer-card bg-white shadow px-5 py-3 rounded-xl border text-center">
        <p className="text-sm text-gray-500">
          Unassigned {stageLabel} Orders
        </p>
        <p className="text-3xl font-bold text-primary">
          {isLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            unassignedCount
          )}
        </p>
      </div>
    </div>
  );
}
