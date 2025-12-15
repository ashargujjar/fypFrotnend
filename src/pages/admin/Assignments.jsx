import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function Assignments() {
  const initialOrders = [
    {
      id: "ORD-4821",
      customer: "GreenMart",
      pickup: "Lahore - Warehouse 3",
      dropoff: "Islamabad - F8",
      window: "Today, 2-5 PM",
      rider: "",
    },
    {
      id: "ORD-4832",
      customer: "MegaMart",
      pickup: "Karachi - Port",
      dropoff: "Hyderabad - City Center",
      window: "Today, 4-7 PM",
      rider: "",
    },
    {
      id: "ORD-4840",
      customer: "PharmaPlus",
      pickup: "Lahore - Lab Hub",
      dropoff: "Multan - Main Clinic",
      window: "Tomorrow, 9-11 AM",
      rider: "Ali Raza",
    },
    {
      id: "ORD-4844",
      customer: "FreshBasket",
      pickup: "Rawalpindi - Cold Storage",
      dropoff: "Islamabad - G7",
      window: "Tomorrow, 12-2 PM",
      rider: "",
    },
  ];

  const riders = [
    { id: "R-001", name: "Ali Raza", zone: "Central" },
    { id: "R-002", name: "Fatima Khan", zone: "North" },
    { id: "R-003", name: "Umar Farooq", zone: "South" },
    { id: "R-004", name: "Sara Imran", zone: "Central" },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [selectedRiders, setSelectedRiders] = useState({});

  const unassignedCount = orders.filter((o) => !o.rider).length;
  const assignedToday = orders.filter((o) => o.rider).length;

  const handleAssign = (orderId) => {
    const rider = selectedRiders[orderId];
    if (!rider) return;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, rider, status: "Assigned" } : order
      )
    );

    setSelectedRiders((prev) => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />

        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">Rider Assignments</h1>
              <p className="text-gray-600">
                Track unassigned orders and dispatch the nearest rider.
              </p>
            </div>
            <div className="bg-white shadow px-5 py-3 rounded-xl border text-center">
              <p className="text-sm text-gray-500">Unassigned Orders</p>
              <p className="text-3xl font-bold text-primary">{unassignedCount}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <OverviewCard
              label="Ready To Dispatch"
              value={unassignedCount}
              accent="text-red-600 bg-red-50"
            />
            <OverviewCard
              label="Assigned To Riders"
              value={assignedToday}
              accent="text-green-600 bg-green-50"
            />
            <OverviewCard
              label="Riders Online"
              value={riders.length}
              accent="text-blue-600 bg-blue-50"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary">
                Unassigned Rider Orders
              </h2>
              <p className="text-sm text-gray-600">
                Choose a rider and click Assign to dispatch.
              </p>
            </div>

            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                  <th className="p-3 font-semibold">Order ID</th>
                  <th className="p-3 font-semibold">Customer</th>
                  <th className="p-3 font-semibold">Pickup</th>
                  <th className="p-3 font-semibold">Drop-off</th>
                  <th className="p-3 font-semibold">Time Window</th>
                  <th className="p-3 font-semibold">Assign Rider</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-xs text-gray-500">
                        {order.rider ? "Assigned" : "Unassigned"}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold">{order.customer}</p>
                      <p className="text-xs text-gray-500">Priority</p>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{order.pickup}</td>
                    <td className="p-3 text-sm text-gray-700">{order.dropoff}</td>
                    <td className="p-3 text-sm text-gray-700">{order.window}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedRiders[order.id] ?? order.rider ?? ""}
                          onChange={(e) =>
                            setSelectedRiders((prev) => ({
                              ...prev,
                              [order.id]: e.target.value,
                            }))
                          }
                          className="border rounded-lg px-3 py-2 text-sm w-40"
                        >
                          <option value="">Select Rider</option>
                          {riders.map((rider) => (
                            <option key={rider.id} value={rider.name}>
                              {rider.name} · {rider.zone}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(order.id)}
                          className="bg-primary text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!selectedRiders[order.id]}
                        >
                          Assign
                        </button>
                      </div>
                      {order.rider && (
                        <p className="text-xs text-gray-500 mt-1">
                          Currently: {order.rider}
                        </p>
                      )}
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

function OverviewCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accent}`}>
        ●
      </div>
    </div>
  );
}
