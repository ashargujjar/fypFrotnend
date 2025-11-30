import { useLocation } from "react-router-dom";
import RiderSidebar from "./components/RiderSidebar";
import RiderTopbar from "./components/RiderTopbar";

export default function Navigation() {
  const query = new URLSearchParams(useLocation().search);
  const shipmentId = query.get("shipment") || "SS-0000";
  const mode = query.get("mode") || "to-pickup"; // to-pickup | to-dropoff

  // Dummy shipment data for UI demonstration
  const shipment = {
    id: shipmentId,
    pickup: "Lahore Warehouse",
    dropoff: "Islamabad F-10",
    status: mode === "to-pickup" ? "Going to Pickup" : "Out for Delivery",
    distance: mode === "to-pickup" ? "12.4 km" : "7.8 km",
    eta: mode === "to-pickup" ? "18 minutes" : "12 minutes",
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      <RiderSidebar />

      <div className="flex-1">
        <RiderTopbar />

        <div className="p-4 sm:p-6 md:p-8">
          {/* PAGE TITLE */}
          <h1 className="text-2xl font-bold text-primary mb-6">
            Navigate to Location
          </h1>

          {/* MAP CARD */}
          <div className="bg-white p-6 shadow rounded-xl mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">
              Live Navigation Map
            </h2>

            <div className="relative w-full h-[450px] bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center shadow-inner">
              {/* Mapbox placeholder */}
              Mapbox Navigation Will Load Here…
              {/* Rider Bubble */}
              <div className="absolute top-6 left-6 bg-white px-5 py-3 rounded-xl shadow border">
                <p className="text-xs text-gray-500">Your Location</p>
                <p className="font-bold text-primary">Rider Position</p>
              </div>
              {/* Destination Bubble */}
              <div className="absolute top-6 right-6 bg-white px-5 py-3 rounded-xl shadow border">
                <p className="text-xs text-gray-500">Destination</p>
                <p className="font-bold text-primary">
                  {shipment.status === "Going to Pickup"
                    ? shipment.pickup
                    : shipment.dropoff}
                </p>
              </div>
              {/* Distance + ETA */}
              <div className="absolute bottom-6 left-6 bg-white px-5 py-3 rounded-xl shadow border">
                <p className="text-xs text-gray-500">Distance</p>
                <p className="font-bold text-dark text-lg">
                  {shipment.distance}
                </p>
              </div>
              <div className="absolute bottom-6 right-6 bg-white px-5 py-3 rounded-xl shadow border">
                <p className="text-xs text-gray-500">ETA</p>
                <p className="font-bold text-dark text-lg">{shipment.eta}</p>
              </div>
            </div>
          </div>

          {/* PARCEL SUMMARY */}
          <div className="bg-white p-6 shadow rounded-xl mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">
              Shipment Summary
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong>Shipment ID:</strong> {shipment.id}
              </p>
              <p>
                <strong>Status:</strong> {shipment.status}
              </p>
              <p>
                <strong>Pickup:</strong> {shipment.pickup}
              </p>
              <p>
                <strong>Dropoff:</strong> {shipment.dropoff}
              </p>
            </div>
          </div>

          {/* REACHED BUTTON */}
          <div className="bg-white p-6 shadow rounded-xl">
            <button
              onClick={() => {
                // Send rider to Scan or POD
                if (mode === "to-pickup") {
                  window.location.href = `/rider/scan?shipment=${shipment.id}`;
                } else {
                  window.location.href = `/rider/pod?shipment=${shipment.id}`;
                }
              }}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {mode === "to-pickup" ? "Mark as Reached Pickup" : "Mark as Delivered"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
