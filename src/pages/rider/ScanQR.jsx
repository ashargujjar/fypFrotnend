import { useLocation } from "react-router-dom";
import RiderSidebar from "./components/RiderSidebar";
import RiderTopbar from "./components/RiderTopbar";

export default function ScanQR() {
  const query = new URLSearchParams(useLocation().search);
  const shipmentId = query.get("shipment") || "SS-0000";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      <RiderSidebar />

      <div className="flex-1">
        <RiderTopbar />

        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Scan Shipment QR
          </h1>

          <div className="bg-white shadow p-6 rounded-xl">
            <p className="text-sm text-gray-500 mb-3">
              Shipment ID: <span className="font-semibold">{shipmentId}</span>
            </p>
            <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
              Camera Preview Here
            </div>

            <button
              onClick={() =>
                (window.location.href = `/rider/navigation?mode=to-dropoff&shipment=${shipmentId}`)
              }
              className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Confirm Scan & Start Delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
