import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { useState } from "react";

export default function TrackShipment() {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState(null);

  // Dummy shipment response
  const sampleShipment = {
    id: "SS-1012",
    status: "In Transit",
    location: "Rawalpindi",
    eta: "2 hours",
    lastUpdate: "2025-01-21 01:10 PM",
    timeline: [
      { event: "Picked Up", time: "2025-01-20 10:30 AM" },
      { event: "Left Warehouse", time: "2025-01-20 12:45 PM" },
      { event: "In Transit – Motorway", time: "2025-01-21 01:10 PM" },
    ],
    mapPlaceholder: true,
  };

  const handleTrack = () => {
    if (trackingId.trim() !== "") {
      setShipment(sampleShipment);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1">
        <Topbar />

        <div className="p-4 sm:p-6 md:p-8">
          {/* PAGE TITLE */}
          <h1 className="text-2xl font-bold text-primary mb-6">
            Track Shipment
          </h1>

          {/* SEARCH BOX */}
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter Shipment ID..."
              className="flex-1 px-4 py-3 rounded-lg border outline-none focus:border-primary"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
            <button
              onClick={handleTrack}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Track
            </button>
          </div>

          {/* RESULT CARD */}
          {shipment && (
            <div className="mt-10 space-y-10">
              {/* SUMMARY */}
              <div className="bg-white p-8 rounded-xl shadow">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Shipment Overview
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600">Shipment ID</p>
                    <p className="font-bold text-dark">{shipment.id}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-bold text-yellow-600">
                      {shipment.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">ETA</p>
                    <p className="font-bold text-dark">{shipment.eta}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Last Known Location</p>
                    <p className="font-bold text-dark">{shipment.location}</p>
                  </div>

                  <div>
                    <p className="text-gray-600">Last Update</p>
                    <p className="font-bold text-dark">{shipment.lastUpdate}</p>
                  </div>
                </div>
              </div>

              {/* MAP */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Live Location
                </h2>

                <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                  Mapbox Map Coming Here
                </div>
              </div>

              {/* TIMELINE */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Shipment Timeline
                </h2>

                <ul className="space-y-4">
                  {shipment.timeline.map((item, i) => (
                    <li key={i} className="border-l-4 border-primary pl-4">
                      <p className="font-semibold">{item.event}</p>
                      <p className="text-gray-500 text-sm">{item.time}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* IOT ALERTS */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold text-primary mb-4">
                  IoT Alerts
                </h2>

                <ul className="space-y-3">
                  <li className="bg-red-100 text-red-700 p-3 rounded-lg font-semibold">
                    Temperature exceeded threshold at 1:45 PM
                  </li>
                  <li className="bg-yellow-100 text-yellow-700 p-3 rounded-lg font-semibold">
                    Route deviation detected
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
