import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";
import { useState } from "react";

export default function AdminDashboardHome() {
  const [complaints, setComplaints] = useState([
    {
      id: "C-001",
      customer: "Ayesha Khan",
      shipmentId: "SS-1012",
      category: "Delayed Delivery",
      issue: "Package arrived 3 days late.",
      status: "Pending",
      priority: "High",
      date: "2025-01-18",
    },
    {
      id: "C-002",
      customer: "Hamza Ali",
      shipmentId: "SS-1090",
      category: "Damaged Parcel",
      issue: "Box was crushed on delivery.",
      status: "In Progress",
      priority: "Medium",
      date: "2025-01-17",
    },
    {
      id: "C-003",
      customer: "Sara Iqbal",
      shipmentId: "SS-1125",
      category: "Rider Behavior",
      issue: "Rider was unprofessional on call.",
      status: "Resolved",
      priority: "Low",
      date: "2025-01-15",
    },
  ]);

  const updateComplaintStatus = (id, status) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );
  };

  const getStatusColor = (status) => {
    if (status === "Resolved") return "bg-green-100 text-green-700";
    if (status === "In Progress") return "bg-blue-100 text-blue-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const getPriorityColor = (priority) => {
    if (priority === "High") return "bg-red-100 text-red-700";
    if (priority === "Medium") return "bg-orange-100 text-orange-700";
    if (priority === "Low") return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            System Overview
          </h1>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Shipments" value="1240" icon="TS" />
            <StatCard title="Active Shipments" value="89" icon="AS" />
            <StatCard title="Delivered Today" value="57" icon="DT" />
            <StatCard title="Customers" value="42" icon="C" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow rounded-xl lg:col-span-2">
              <h2 className="text-xl font-bold text-primary mb-4">Live Map</h2>
              <div className="w-full h-[350px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                Map Coming Soon...
              </div>
            </div>

            <div className="bg-white p-6 shadow rounded-xl">
              <h2 className="text-xl font-bold text-primary mb-4">
                Critical Alerts
              </h2>

              <ul className="space-y-3">
                <li className="bg-red-100 px-4 py-2 rounded-lg text-red-700 font-semibold">
                  Temperature breach on SS-1125
                </li>
                <li className="bg-yellow-100 px-4 py-2 rounded-lg text-yellow-700 font-semibold">
                  Rider deviation on SS-1090
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 shadow rounded-xl mt-10 overflow-x-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-primary">
                Complaint Management
              </h2>
              <div className="text-sm text-gray-600">
                {complaints.filter((c) => c.status !== "Resolved").length} open
                complaints
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Complaint ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Shipment</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Issue</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-semibold text-primary">
                      {complaint.id}
                    </td>
                    <td className="p-3">{complaint.customer}</td>
                    <td className="p-3">{complaint.shipmentId}</td>
                    <td className="p-3">{complaint.category}</td>
                    <td className="p-3">{complaint.issue}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${getPriorityColor(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="p-3">{complaint.date}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded-lg px-2 py-1 text-sm outline-none focus:border-primary"
                          value={complaint.status}
                          onChange={(e) =>
                            updateComplaintStatus(
                              complaint.id,
                              e.target.value
                            )
                          }
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>
                        <button
                          className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                          onClick={() =>
                            updateComplaintStatus(complaint.id, "Resolved")
                          }
                          disabled={complaint.status === "Resolved"}
                        >
                          Resolve
                        </button>
                      </div>
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

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
