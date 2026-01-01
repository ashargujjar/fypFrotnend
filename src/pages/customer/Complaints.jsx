import Topbar from "./components/Topbar";
import { useState } from "react";

export default function Complaints() {
  const [complaintText, setComplaintText] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const complaintsHistory = [
    {
      id: "C-001",
      shipmentId: "SS-1012",
      issue: "Delay in delivery",
      status: "Pending",
      date: "2025-01-18",
    },
    {
      id: "C-002",
      shipmentId: "SS-1090",
      issue: "Parcel damaged",
      status: "Resolved",
      date: "2025-01-15",
    },
  ];

  const getStatusColor = (status) => {
    if (status === "Resolved") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-light">
      <Topbar />

      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">Complaints</h1>

          {/* NEW COMPLAINT FORM */}
          <div className="bg-white shadow rounded-xl p-8 mb-10">
            <h2 className="text-xl font-bold text-primary mb-6">
              Submit a Complaint
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipment ID */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Shipment ID
                </label>
                <select
                  className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                  value={shipmentId}
                  onChange={(e) => setShipmentId(e.target.value)}
                >
                  <option>Select Shipment</option>
                  <option>SS-1012</option>
                  <option>SS-1090</option>
                  <option>SS-1121</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Category
                </label>
                <select
                  className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Select Category</option>
                  <option>Delayed Delivery</option>
                  <option>Damaged Parcel</option>
                  <option>Wrong Delivery</option>
                  <option>Rider Behavior</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-1">
                Complaint Description
              </label>
              <textarea
                rows="4"
                className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                placeholder="Explain the issue in detail..."
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-1">
                Attach an Image (Optional)
              </label>
              <input
                type="file"
                className="block w-full p-3 bg-white border rounded-lg"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            {/* Submit Button */}
            <button className="mt-8 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Submit Complaint
            </button>
          </div>

          {/* COMPLAINT HISTORY */}
          <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
            <h2 className="text-xl font-bold text-primary mb-4">
              Complaint History
            </h2>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Complaint ID</th>
                  <th className="p-3">Shipment ID</th>
                  <th className="p-3">Issue</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {complaintsHistory.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-semibold text-primary">{c.id}</td>
                    <td className="p-3">{c.shipmentId}</td>
                    <td className="p-3">{c.issue}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
