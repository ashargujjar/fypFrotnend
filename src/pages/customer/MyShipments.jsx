import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shipments } from "./data/shipments";

export default function MyShipments() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "In Transit") return "bg-yellow-100 text-yellow-700";
    if (status === "Alert") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1">
        {/* Topbar */}
        <Topbar />

        <div className="p-4 sm:p-6 md:p-8">
          {/* Section Title */}
          <h1 className="text-2xl font-bold text-primary mb-6">My Shipments</h1>

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search shipment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white border w-full md:w-1/3 outline-none focus:border-primary"
            />

            {/* Status Filter */}
            <select className="px-4 py-3 rounded-lg bg-white border outline-none focus:border-primary">
              <option>Status: All</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Alert</option>
            </select>

            {/* Date Filter */}
            <select className="px-4 py-3 rounded-lg bg-white border outline-none focus:border-primary">
              <option>Date: All</option>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          {/* Shipments Table */}
          <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Shipment ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">ETA</th>
                  <th className="p-3">Type</th>
                </tr>
              </thead>

              <tbody>
                {shipments
                  .filter((s) =>
                    s.id.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((s) => (
                    <tr
                      key={s.id}
                      className="border-b hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => navigate(`/customer/shipments/${s.id}`)}
                    >
                      <td className="p-3 font-semibold text-primary">{s.id}</td>
                      <td className="p-3">{s.date}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(s.status)}`}
                        >
                          {s.status}
                        </span>
                      </td>

                      <td className="p-3">{s.location}</td>
                      <td className="p-3">{s.eta}</td>
                      <td className="p-3">{s.type}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-6 space-x-2">
            <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100">
              Prev
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100">
              2
            </button>
            <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
