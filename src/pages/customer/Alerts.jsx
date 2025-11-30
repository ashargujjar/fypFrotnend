import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function Alerts() {
  const alerts = [
    {
      id: 1,
      type: "Temperature Breach",
      shipmentId: "SS-1121",
      value: "Exceeded 12°C",
      time: "2025-01-21 01:45 PM",
      severity: "High",
    },
    {
      id: 2,
      type: "Route Deviation",
      shipmentId: "SS-1012",
      value: "Rider off-route",
      time: "2025-01-21 01:20 PM",
      severity: "Medium",
    },
    {
      id: 3,
      type: "Shock Detected",
      shipmentId: "SS-1012",
      value: "High impact detected",
      time: "2025-01-21 01:10 PM",
      severity: "Low",
    },
  ];

  const severityColor = (s) => {
    if (s === "High") return "bg-red-100 text-red-700";
    if (s === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Alerts Center
          </h1>

          <div className="bg-white p-6 shadow rounded-xl space-y-4">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="border-b py-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-dark">{a.type}</h3>
                  <p className="text-gray-600 text-sm">{a.value}</p>
                  <p className="text-gray-400 text-xs">
                    Shipment: {a.shipmentId}
                  </p>
                  <p className="text-gray-400 text-xs">{a.time}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-lg font-semibold ${severityColor(a.severity)}`}
                >
                  {a.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
