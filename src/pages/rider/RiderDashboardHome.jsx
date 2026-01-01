import RiderSidebar from "./components/RiderSidebar";
import RiderTopbar from "./components/RiderTopbar";

export default function RiderDashboardHome() {
  const summary = [
    {
      title: "Pickup Tasks",
      desc: "Same-city pickups only. Intercity legs move to linehaul.",
      count: 2,
      link: "/rider/pickups",
      cta: "Go to Pickups",
    },
    {
      title: "Linehaul / Hub Transfer",
      desc: "Intercity loads and hub-to-hub moves.",
      count: 2,
      link: "/rider/linehaul",
      cta: "Manage Linehaul",
    },
    {
      title: "Delivery Tasks",
      desc: "Final-mile only; appears after destination hub receives.",
      count: 2,
      link: "/rider/deliveries",
      cta: "Go to Deliveries",
    },
  ];
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      <RiderSidebar />

      <div className="flex-1">
        <RiderTopbar />

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">Rider Tasks</h1>
            <p className="text-gray-600">
              Pickup rider ≠ Linehaul rider ≠ Delivery rider. Intercity legs stay in
              linehaul; city drops appear only after destination hub scan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {summary.map((card) => (
              <div key={card.title} className="bg-white shadow rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-primary">{card.title}</h3>
                  <span className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700">
                    {card.count} tasks
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{card.desc}</p>
                <button
                  onClick={() => (window.location.href = card.link)}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {card.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-primary">IoT Alerts</h2>
              <p className="text-sm text-gray-600">
                View temperature and shock breaches for assigned shipments.
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/rider/alerts")}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View Alerts
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-primary mb-3">Flow Guidance</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              <li>Pickups: Start -> Arrive -> Confirm Pickup -> Hand off to hub.</li>
              <li>Linehaul: Start Trip -> Reach Destination Hub -> Upload manifest.</li>
              <li>Delivery: Start Delivery -> Arrived -> Collect OTP/Signature -> POD photo -> Deliver.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
