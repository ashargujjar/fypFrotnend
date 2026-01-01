import Topbar from "./components/Topbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shipments } from "./data/shipments";

export default function TrackShipment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trackingId, setTrackingId] = useState(id ?? "");
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setShipment(null);
      setError("");
      return;
    }
    const matched = shipments.find(
      (item) => item.id.toLowerCase() === id.toLowerCase()
    );
    if (!matched) {
      setShipment(null);
      setError("No shipment found for that ID.");
      return;
    }
    setShipment(matched);
    setError("");
  }, [id]);

  const handleTrack = () => {
    const nextId = trackingId.trim();
    if (!nextId) return;
    navigate(`/customer/track/${nextId}`);
  };

  const statusClass =
    shipment?.status === "Delivered"
      ? "text-green-600"
      : shipment?.status === "In Transit"
        ? "text-yellow-600"
        : shipment?.status === "Alert"
          ? "text-red-600"
          : "text-gray-600";

  return (
    <div className="min-h-screen bg-light">
      <Topbar />

      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Track Shipment
        </h1>

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

          {error && (
            <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
          )}

          {shipment && (
            <div className="mt-10 space-y-10">
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
                    <p className={`font-bold ${statusClass}`}>
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
                    <p className="font-bold text-dark">
                      {shipment.updatedAt ?? "Recently"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Live Location
                </h2>

                <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                  Mapbox Map Coming Here
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Shipment Timeline
                </h2>

                <ul className="space-y-4">
                  {shipment.timeline.map((item) => (
                    <li
                      key={`${shipment.id}-${item.timestamp}`}
                      className="border-l-4 border-primary pl-4"
                    >
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-gray-500 text-sm">
                        {item.timestamp}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold text-primary mb-4">
                  IoT Alerts
                </h2>

                <ul className="space-y-3">
                  {shipment.alerts.map((alert) => (
                    <li
                      key={`${shipment.id}-${alert}`}
                      className="bg-red-100 text-red-700 p-3 rounded-lg font-semibold"
                    >
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
