import { useLocation, useNavigate } from "react-router-dom";
import RiderSidebar from "./components/RiderSidebar";
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
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      <RiderSidebar />
      <div className="flex-1">
        <RiderTopbar />

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-primary">{title}</h1>
              {note && <p className="text-gray-600">{note}</p>}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-white border px-3 py-2 rounded-lg text-sm hover:border-primary/40"
            >
              Back to tasks
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6 space-y-2">
            <p className="text-xs text-gray-500">Route Details</p>
            <p className="text-sm text-gray-700">
              <strong>From:</strong> {from}
            </p>
            <p className="text-sm text-gray-700">
              <strong>To:</strong> {to}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
              Map will render here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
