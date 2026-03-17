import RiderTopbar from "./components/RiderTopbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useRiderProfile from "./hooks/useRiderProfile";
const API_URL = import.meta.env.VITE_API_URL;

export default function RiderDashboardHome() {
  const { profile, loading } = useRiderProfile();
  const token = localStorage.getItem("token");
  const category = String(profile?.riderCategory || "").toLowerCase();
  const activeCategory =
    category === "pickup" || category === "linehaul" || category === "delivery"
      ? category
      : "";
  const [tasksCount, setTasksCount] = useState(0);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setTasksLoading(false);
      setTasksCount(0);
      return;
    }

    let isMounted = true;

    const loadTasks = async () => {
      try {
        setTasksLoading(true);
        const endpoint = API_URL
          ? `${API_URL}/rider/getRiderTasks`
          : "/rider/getRiderTasks";
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load rider tasks.");
        }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.tasks)
            ? data.tasks
            : Array.isArray(data?.riderTasks)
              ? data.riderTasks
              : Array.isArray(data?.data)
                ? data.data
                : [];
        if (isMounted) setTasksCount(list.length);
      } catch {
        if (isMounted) setTasksCount(0);
      } finally {
        if (isMounted) setTasksLoading(false);
      }
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const filterByCategory = (items) => {
    if (!activeCategory) return items;
    return items.filter(
      (item) => item.categoryKey === "all" || item.categoryKey === activeCategory
    );
  };

  const resolveCount = () => (tasksLoading ? "..." : String(tasksCount));
  const countForCategory = (key) => {
    if (!activeCategory) return resolveCount();
    return activeCategory === key ? resolveCount() : "0";
  };

  const stats = [
    {
      title: "Pickup Tasks",
      value: countForCategory("pickup"),
      icon: "PU",
      categoryKey: "pickup",
    },
    {
      title: "Linehaul Trips",
      value: countForCategory("linehaul"),
      icon: "LH",
      categoryKey: "linehaul",
    },
    {
      title: "Delivery Tasks",
      value: countForCategory("delivery"),
      icon: "DL",
      categoryKey: "delivery",
    },
    { title: "Active Alerts", value: 3, icon: "AL", categoryKey: "all" },
  ];

  const quickActions = [
    {
      title: "Pickup Tasks",
      description: "Same-city pickups only. Intercity legs move to linehaul.",
      to: "/rider/pickups",
      icon: "PU",
      iconClass: "bg-primary",
      orbClass: "bg-primary/10",
      count: countForCategory("pickup"),
      categoryKey: "pickup",
    },
    {
      title: "Linehaul / Hub Transfer",
      description: "Intercity loads and hub-to-hub moves.",
      to: "/rider/linehaul",
      icon: "LH",
      iconClass: "bg-amber-500",
      orbClass: "bg-amber-200/40",
      count: countForCategory("linehaul"),
      categoryKey: "linehaul",
    },
    {
      title: "Delivery Tasks",
      description: "Final-mile only; appears after destination hub receives.",
      to: "/rider/deliveries",
      icon: "DL",
      iconClass: "bg-emerald-500",
      orbClass: "bg-emerald-200/40",
      count: countForCategory("delivery"),
      categoryKey: "delivery",
    },
  ];

  const flowGuidance = [
    {
      key: "pickup",
      text: "Pickups: Start -> Arrive -> Confirm Pickup -> Hand off to hub.",
    },
    {
      key: "linehaul",
      text: "Linehaul: Start Trip -> Reach Destination Hub -> Upload manifest.",
    },
    {
      key: "delivery",
      text:
        "Delivery: Start Delivery -> Arrived -> Collect OTP/Signature -> POD photo -> Deliver.",
    },
  ];

  const visibleStats = filterByCategory(stats);
  const visibleActions = filterByCategory(quickActions);
  const visibleGuidance = activeCategory
    ? flowGuidance.filter((item) => item.key === activeCategory)
    : flowGuidance;

  return (
    <div className="min-h-screen bg-light customer-page">
      <RiderTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-primary">Rider Overview</h1>
          <p className="text-gray-600">
            Pickup rider != Linehaul rider != Delivery rider. Intercity legs stay
            in linehaul; city drops appear only after destination hub scan.
          </p>
          {loading && (
            <p className="text-xs text-gray-500">
              Loading your rider category...
            </p>
          )}
        </div>

        <div className="customer-stack grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {visibleStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold text-primary mb-4">Quick Actions</h2>
          <div className="customer-stack grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="customer-card customer-card-elevate group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div
                  className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${action.orbClass} transition group-hover:scale-110`}
                />
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-white font-semibold ${action.iconClass}`}
                  >
                    {action.icon}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                    {action.count} tasks
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  {action.title}
                </p>
                <p className="text-sm text-slate-500">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="customer-card bg-white p-6 shadow rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-primary">IoT Alerts</h2>
              <p className="text-sm text-gray-600">
                View temperature and shock breaches for assigned shipments.
              </p>
            </div>
            <Link
              to="/rider/alerts"
              className="customer-button bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
            >
              View Alerts
            </Link>
          </div>
        </div>

        <div>
          <div className="customer-card bg-white p-6 shadow rounded-xl">
            <h2 className="text-lg font-bold text-primary mb-3">Flow Guidance</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              {visibleGuidance.map((item) => (
                <li key={item.key}>{item.text}</li>
              ))}
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
