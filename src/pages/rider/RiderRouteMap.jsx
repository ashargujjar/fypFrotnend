import { useLocation, useNavigate } from "react-router-dom";
import RiderTopbar from "./components/RiderTopbar";

export default function RiderRouteMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const title = state.title || "Route Preview";
  const from = state.from || "Your current location";
  const to = state.to || "Destination not provided";
  const note = state.note || "";

  return (
    <div className="min-h-screen bg-light customer-page">
      <RiderTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
            {note && <p className="text-gray-600">{note}</p>}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="customer-button bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm hover:border-primary/40"
          >
            Back to tasks
          </button>
        </div>

        <div className="customer-card bg-white rounded-xl shadow p-6 space-y-2">
          <p className="text-xs text-gray-500">Route Details</p>
          <p className="text-sm text-gray-700">
            <strong>From:</strong> {from}
          </p>
          <p className="text-sm text-gray-700">
            <strong>To:</strong> {to}
          </p>
        </div>

        <div className="customer-card bg-white rounded-xl shadow p-6">
          <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
            Map will render here
          </div>
        </div>
      </div>
    </div>
  );
}
