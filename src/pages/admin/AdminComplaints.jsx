import { useEffect, useState } from "react";
import AdminTopbar from "./components/AdminTopbar";
const API_URL = import.meta.env.VITE_API_URL;
export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchComplaints = async () => {
      const res = await fetch(`${API_URL}/complaint/Allcomplaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const comp = await res.json();

      if (res.ok) {
        setComplaints(comp.complaints);
        console.log(comp);
      } else {
        console.log("error fetching the");
      }
    };
    fetchComplaints();
  }, []);
  const updateComplaintStatus = async (complaintId, newStatus) => {
    console.log("Updating:", complaintId, newStatus);

    try {
      const res = await fetch(
        `${API_URL}/complaint/updateStatus/${complaintId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setComplaints((prev) =>
          prev.map((c) =>
            c._id === complaintId ? { ...c, status: newStatus } : c,
          ),
        );

        // Clear selected value
        setSelectedStatuses((prev) => {
          const updated = { ...prev };
          delete updated[complaintId];
          return updated;
        });
      } else {
        console.log("Update failed:", data.message);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };
  const getStatusColor = (status) => {
    if (status === "Resolved") return "bg-green-100 text-green-700";
    if (status === "In Progress") return "bg-blue-100 text-blue-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const openCount = complaints.filter((c) => c.status !== "Resolved").length;

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Complaint Management
            </h1>
            <p className="text-sm text-gray-600">
              Review tickets, respond to escalations, and close cases.
            </p>
          </div>
          <div className="customer-card bg-white border rounded-xl px-5 py-3 text-center shadow">
            <p className="text-sm text-gray-500">Open Complaints</p>
            <p className="text-2xl font-bold text-primary">{openCount}</p>
          </div>
        </div>

        <div className="customer-card bg-white p-6 shadow rounded-xl overflow-x-auto">
          <table className="w-full text-left min-w-[860px]">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600">
                <th className="p-3">Complaint ID</th>
                <th className="p-3">Shipment</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-semibold text-primary">
                    {complaint._id}
                  </td>
                  <td className="p-3">{complaint.shipmentId}</td>
                  <td className="p-3">{complaint.category}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(
                        complaint.status,
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </td>
                  <td className="p-3">{complaint.createdAt}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <select
                        className="border rounded-lg px-2 py-1 text-sm outline-none focus:border-primary"
                        value={
                          selectedStatuses[complaint._id] || complaint.status
                        }
                        onChange={(e) =>
                          setSelectedStatuses((prev) => ({
                            ...prev,
                            [complaint._id]: e.target.value,
                          }))
                        }
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>
                      <button
                        className="customer-button bg-primary text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                        onClick={() =>
                          updateComplaintStatus(
                            complaint._id,
                            selectedStatuses[complaint._id] || complaint.status,
                          )
                        }
                        disabled={complaint.status === "Resolved"}
                      >
                        Update
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
  );
}
