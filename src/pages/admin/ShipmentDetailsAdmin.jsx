import { useParams } from "react-router-dom";
import { useState } from "react";
import AdminTopbar from "./components/AdminTopbar";

export default function ShipmentDetailsAdmin() {
  const { id } = useParams();

  // Dummy shipment data
  const [shipment] = useState({
    id: id,
    partner: "TechCart Pvt Ltd",
    rider: "Not Assigned",
    origin: "Lahore Warehouse",
    destination: "Islamabad F-10",
    status: "At Origin Warehouse",
    weight: "2.5kg",
    type: "Electronics",
    temperature: { current: 14, unit: "C" },
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

  const riderDirectory = {
    "Ali Raza": {
      id: "R-001",
      phone: "+92 300 1234567",
      city: "Lahore",
      zone: "Central",
    },
    "Umar Farooq": {
      id: "R-002",
      phone: "+92 301 2223344",
      city: "Karachi",
      zone: "South",
    },
    "Bilal Ahmed": {
      id: "R-003",
      phone: "+92 302 9876543",
      city: "Islamabad",
      zone: "North",
    },
  };
  const riderAssigned =
    shipment.rider && shipment.rider.toLowerCase() !== "not assigned";
  const riderDetails = riderAssigned ? riderDirectory[shipment.rider] : null;

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
          {/* TITLE */}
          <h1 className="text-2xl font-bold text-primary mb-6">
            Shipment Details - {shipment.id}
          </h1>

          {/* MAP SECTION */}
          <div className="customer-card bg-white p-6 shadow rounded-xl mb-10">
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
          <div className="customer-card bg-white p-6 shadow rounded-xl mb-10">
            <h2 className="text-xl font-bold text-primary mb-4">
              Shipment Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <p>
                <strong>Partner:</strong> {shipment.partner}
              </p>
              <p>
                <strong>Assigned Rider:</strong>{" "}
                {riderAssigned ? shipment.rider : "No rider assigned"}
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

          </div>

          {/* RIDER INFO */}
          <div className="customer-card bg-white p-6 shadow rounded-xl mb-10">
            <h2 className="text-xl font-bold text-primary mb-4">
              Rider Information
            </h2>

            {!riderAssigned ? (
              <p className="text-gray-500">No rider assigned.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <p>
                  <strong>Name:</strong> {shipment.rider}
                </p>
                <p>
                  <strong>Rider ID:</strong> {riderDetails?.id || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {riderDetails?.phone || "N/A"}
                </p>
                <p>
                  <strong>City:</strong> {riderDetails?.city || "N/A"}
                </p>
                <p>
                  <strong>Zone:</strong> {riderDetails?.zone || "N/A"}
                </p>
              </div>
            )}
          </div>

          {/* TIMELINE */}
          <div className="customer-card bg-white p-6 shadow rounded-xl mb-10">
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
          <div className="customer-card bg-white p-6 shadow rounded-xl mb-8">
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

      </div>
    </div>
  );
}
