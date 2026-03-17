import { useEffect, useState } from "react";
import AdminTopbar from "./components/AdminTopbar";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboardHome() {
  const token = localStorage.getItem("token");

  const [countDashboard, setCountDashboard] = useState({
    totalUsers: 0,
    totalShipments: 0,
    activeShipments: 0,
    deliveredShipments: 0,
  });
  const quickActions = [
    {
      title: "Manage Shipments",
      description: "Track, review, and audit every shipment.",
      to: "/admin/shipments",
      icon: "SH",
      iconClass: "bg-primary",
      orbClass: "bg-primary/10",
    },
    {
      title: "Rider Management",
      description: "Add riders and monitor delivery performance.",
      to: "/admin/riders",
      icon: "RD",
      iconClass: "bg-amber-500",
      orbClass: "bg-amber-200/40",
    },
    {
      title: "Dispatch Assignments",
      description: "Assign orders and balance rider workloads.",
      to: "/admin/assignments",
      icon: "AS",
      iconClass: "bg-emerald-500",
      orbClass: "bg-emerald-200/40",
    },
    {
      title: "IoT Center",
      description: "Monitor devices, sensors, and alerts.",
      to: "/admin/iot",
      icon: "IOT",
      iconClass: "bg-cyan-500",
      orbClass: "bg-cyan-200/40",
    },
    {
      title: "Manage Cities",
      description: "Add cities and manage service zones.",
      to: "/admin/cities",
      icon: "CT",
      iconClass: "bg-indigo-500",
      orbClass: "bg-indigo-200/40",
    },
    {
      title: "Complaint Management",
      description: "Resolve customer tickets and escalations.",
      to: "/admin/complaints",
      icon: "CP",
      iconClass: "bg-rose-500",
      orbClass: "bg-rose-200/40",
    },
    {
      title: "Admin Profile",
      description: "Update admin details and security settings.",
      to: "/admin/profile",
      icon: "PR",
      iconClass: "bg-slate-700",
      orbClass: "bg-slate-200/40",
    },
  ];
  useEffect(() => {
    const getCountDashboard = async () => {
      const res = await fetch(`${API_URL}/admin/countDashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resp = await res.json();
      console.log("resp", resp.dashboardCounts);
      if (res.ok) {
        setCountDashboard(resp.dashboardCounts);
      } else {
        console.log(resp.message);
        console.log("error fetching the counts");
      }
    };
    getCountDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">
          System Overview
        </h1>

        <div className="customer-stack grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Shipments"
            value={countDashboard.totalShipments}
            icon="TS"
          />
          <StatCard
            title="Active Shipments"
            value={countDashboard.activeShipments}
            icon="AS"
          />
          <StatCard
            title="Delivered Today"
            value={countDashboard.deliveredShipments}
            icon="DT"
          />
          <StatCard
            title="Customers"
            value={countDashboard.totalUsers}
            icon="C"
          />
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-primary mb-4">Quick Actions</h2>
          <div className="customer-stack grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="customer-card group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div
                  className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${action.orbClass} transition group-hover:scale-110`}
                />
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-white font-semibold ${action.iconClass}`}
                >
                  {action.icon}
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  {action.title}
                </p>
                <p className="text-sm text-slate-500">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="customer-card bg-white p-6 shadow rounded-xl">
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
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="customer-card customer-card-elevate rounded-xl p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 bg-white">
      <div className="text-3xl sm:text-4xl">{icon}</div>
      <div>
        <h3 className="text-gray-600 text-xs sm:text-sm font-semibold">
          {title}
        </h3>
        <p className="text-xl sm:text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}
