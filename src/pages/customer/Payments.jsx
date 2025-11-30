import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { useState } from "react";

export default function Payments() {
  const [filter, setFilter] = useState("All");

  // Dummy Payment Data
  const payments = [
    {
      id: "PAY-001",
      shipmentId: "SS-1012",
      amount: 350,
      method: "COD",
      status: "Pending",
      date: "2025-01-20",
    },
    {
      id: "PAY-002",
      shipmentId: "SS-1090",
      amount: 550,
      method: "Prepaid",
      status: "Paid",
      date: "2025-01-18",
    },
    {
      id: "PAY-003",
      shipmentId: "SS-1121",
      amount: 300,
      method: "Prepaid",
      status: "Paid",
      date: "2025-01-15",
    },
  ];

  const getStatusColor = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const getMethodColor = (method) => {
    if (method === "COD") return "bg-blue-100 text-blue-700";
    return "bg-purple-100 text-purple-700"; // Prepaid
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
          <h1 className="text-2xl font-bold text-primary mb-6">Payments</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              className={`px-6 py-2 rounded-lg shadow ${
                filter === "All" ? "bg-primary text-white" : "bg-white"
              }`}
              onClick={() => setFilter("All")}
            >
              All
            </button>

            <button
              className={`px-6 py-2 rounded-lg shadow ${
                filter === "COD" ? "bg-primary text-white" : "bg-white"
              }`}
              onClick={() => setFilter("COD")}
            >
              COD
            </button>

            <button
              className={`px-6 py-2 rounded-lg shadow ${
                filter === "Prepaid" ? "bg-primary text-white" : "bg-white"
              }`}
              onClick={() => setFilter("Prepaid")}
            >
              Prepaid
            </button>
          </div>

          {/* Payments Table */}
          <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Shipment ID</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Receipt</th>
                </tr>
              </thead>

              <tbody>
                {payments
                  .filter((p) =>
                    filter === "All" ? true : p.method === filter
                  )
                  .map((p) => (
                    <tr
                      key={p.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-semibold text-primary">{p.id}</td>
                      <td className="p-3">{p.shipmentId}</td>
                      <td className="p-3">Rs. {p.amount}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-semibold ${getMethodColor(
                            p.method
                          )}`}
                        >
                          {p.method}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="p-3">{p.date}</td>

                      <td className="p-3 text-center">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-blue-700 transition">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
