import RiderSidebar from "./components/RiderSidebar";
import RiderTopbar from "./components/RiderTopbar";

export default function RiderAlerts() {
  const alerts = [
    {
      id: "AL-1101",
      shipmentId: "SS-22002",
      type: "Temperature",
      severity: "High",
      message: "Temp exceeded 8C for 4 minutes.",
      location: "Gulberg II, Lahore",
      time: "Today, 9:30 AM",
    },
    {
      id: "AL-1102",
      shipmentId: "SS-22001",
      type: "Shock",
      severity: "Medium",
      message: "Impact detected (3.2g).",
      location: "Johar Town, Lahore",
      time: "Today, 8:05 AM",
    },
    {
      id: "AL-1103",
      shipmentId: "SS-22003",
      type: "Temperature",
      severity: "Low",
      message: "Temp dipped below 2C briefly.",
      location: "Clifton Block 5, Karachi",
      time: "Yesterday, 6:40 PM",
    },
  ];

  return (
    <div className="flex">
      <RiderSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <RiderTopbar />

        <div className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary">IoT Alerts</h1>
              <p className="text-gray-600 text-sm">
                Temperature and shock sensor breaches for assigned shipments.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700">
              {alerts.length} active alerts
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                  <p className="font-semibold text-dark">
                    {alert.type} breach · Shipment {alert.shipmentId}
                  </p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.location}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                  {alert.severity} severity
                </span>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="p-4 border rounded-lg text-sm text-gray-500 text-center">
                No IoT alerts right now.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
