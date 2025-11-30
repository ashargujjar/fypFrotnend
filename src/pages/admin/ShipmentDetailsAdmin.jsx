import { useParams } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function ShipmentDetailsAdmin() {
  const { id } = useParams();

  // Dummy shipment data
  const [shipment, setShipment] = useState({
    id: id,
    partner: "TechCart Pvt Ltd",
    rider: "Not Assigned",
    origin: "Lahore Warehouse",
    destination: "Islamabad F-10",
    status: "At Origin Warehouse",
    weight: "2.5kg",
    type: "Electronics",
    temperature: { current: 14, unit: "°C" },
    shock: { level: "Low", note: "Normal movement" },
    humidity: 40,
    timeline: [
      { label: "Shipment Created", timestamp: "2025-01-10 09:40 AM" },
      { label: "Picked Up by Rider", timestamp: "2025-01-10 11:05 AM" },
      {
        label: "Arrived at Origin Warehouse",
        timestamp: "2025-01-10 01:20 PM",
      },
    ],
  });

  const blockchainLogs = [
    { event: "Created", hash: "0xAAA...223", block: 123441 },
    { event: "Picked Up", hash: "0xBB1...789", block: 123455 },
    { event: "Arrived Warehouse", hash: "0xCC4...991", block: 123476 },
  ];

  const riders = [
    { id: "R-001", name: "Ali Raza" },
    { id: "R-002", name: "Umar Farooq" },
    { id: "R-003", name: "Bilal Ahmed" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState("");

  const assignRider = () => {
    if (!selectedRider) return;

    setShipment((prev) => ({
      ...prev,
      rider: selectedRider,
      status: "Assigned to Rider",
    }));

    setShowModal(false);
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />

        <div className="p-8">
          {/* TITLE */}
          <h1 className="text-2xl font-bold text-primary mb-6">
            Shipment Details — {shipment.id}
          </h1>

          {/* MAP SECTION */}
          <div className="bg-white p-6 shadow rounded-xl mb-10">
            <h2 className="text-xl font-bold text-primary mb-4">
              Live Map & Sensor Data
            </h2>

            <div className="relative w-full h-[450px] bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-500">
              Mapbox (Admin View)
              {/* IoT Overlays */}
              <div className="absolute top-6 left-6 bg-white shadow-xl px-5 py-3 rounded-xl border">
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-3xl font-bold text-red-600">
                  {shipment.temperature.current}
                  {shipment.temperature.unit}
                </p>
              </div>
              <div className="absolute top-6 right-6 bg-white shadow-xl px-5 py-3 rounded-xl border">
                <p className="text-sm text-gray-600">Shock</p>
                <p className="text-xl font-bold text-yellow-600">
                  {shipment.shock.level}
                </p>
                <p className="text-xs text-gray-500">{shipment.shock.note}</p>
              </div>
              <div className="absolute bottom-6 right-6 bg-white shadow-xl px-5 py-3 rounded-xl border">
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="text-xl font-bold text-blue-600">
                  {shipment.humidity}%
                </p>
              </div>
            </div>
          </div>

          {/* SHIPMENT INFO */}
          <div className="bg-white p-6 shadow rounded-xl mb-10">
            <h2 className="text-xl font-bold text-primary mb-4">
              Shipment Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <p>
                <strong>Partner:</strong> {shipment.partner}
              </p>
              <p>
                <strong>Assigned Rider:</strong> {shipment.rider}
              </p>
              <p>
                <strong>Status:</strong> {shipment.status}
              </p>
              <p>
                <strong>Type:</strong> {shipment.type}
              </p>
              <p>
                <strong>Weight:</strong> {shipment.weight}
              </p>
              <p>
                <strong>Origin:</strong> {shipment.origin}
              </p>
              <p>
                <strong>Destination:</strong> {shipment.destination}
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="mt-6 bg-primary text-white px-6 py-3 rounded-lg"
            >
              Assign / Reassign Rider
            </button>
          </div>

          {/* TIMELINE */}
          <div className="bg-white p-6 shadow rounded-xl mb-10">
            <h2 className="text-xl font-bold text-primary mb-4">Timeline</h2>

            <ul className="space-y-4">
              {shipment.timeline.map((t, idx) => (
                <li key={idx} className="border-l-4 border-primary pl-4">
                  <p className="font-semibold">{t.label}</p>
                  <p className="text-sm text-gray-500">{t.timestamp}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* BLOCKCHAIN LOGS */}
          <div className="bg-white p-6 shadow rounded-xl mb-8">
            <h2 className="text-xl font-bold text-primary mb-4">
              Blockchain Verification
            </h2>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3">Event</th>
                  <th className="p-3">Hash</th>
                  <th className="p-3">Block</th>
                </tr>
              </thead>

              <tbody>
                {blockchainLogs.map((log, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3">{log.event}</td>
                    <td className="p-3 text-primary">{log.hash}</td>
                    <td className="p-3">{log.block}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ASSIGN MODAL */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl w-[400px] p-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Assign Rider — {shipment.id}
                </h2>

                <select
                  value={selectedRider}
                  onChange={(e) => setSelectedRider(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:border-primary outline-none"
                >
                  <option value="">Select Rider</option>
                  {riders.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={assignRider}
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
