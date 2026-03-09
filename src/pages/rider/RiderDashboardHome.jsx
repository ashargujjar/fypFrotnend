import RiderTopbar from "./components/RiderTopbar";
import { Link } from "react-router-dom";

export default function RiderDashboardHome() {
  const stats = [
    { title: "Pickup Tasks", value: 2, icon: "PU" },
    { title: "Linehaul Trips", value: 2, icon: "LH" },
    { title: "Delivery Tasks", value: 2, icon: "DL" },
    { title: "Active Alerts", value: 3, icon: "AL" },
  ];

  const quickActions = [
    {
      title: "Pickup Tasks",
      description: "Same-city pickups only. Intercity legs move to linehaul.",
      to: "/rider/pickups",
      icon: "PU",
      iconClass: "bg-primary",
      orbClass: "bg-primary/10",
      count: 2,
    },
    {
      title: "Linehaul / Hub Transfer",
      description: "Intercity loads and hub-to-hub moves.",
      to: "/rider/linehaul",
      icon: "LH",
      iconClass: "bg-amber-500",
      orbClass: "bg-amber-200/40",
      count: 2,
    },
    {
      title: "Delivery Tasks",
      description: "Final-mile only; appears after destination hub receives.",
      to: "/rider/deliveries",
      icon: "DL",
      iconClass: "bg-emerald-500",
      orbClass: "bg-emerald-200/40",
      count: 2,
    },
  ];

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
        </div>

        <div className="customer-stack grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
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
            {quickActions.map((action) => (
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
              <li>Pickups: Start -> Arrive -> Confirm Pickup -> Hand off to hub.</li>
              <li>Linehaul: Start Trip -> Reach Destination Hub -> Upload manifest.</li>
              <li>
                Delivery: Start Delivery -> Arrived -> Collect OTP/Signature ->
                POD photo -> Deliver.
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
