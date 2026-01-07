import AdminTopbar from "./components/AdminTopbar";

export default function IoTCenter() {
  const devices = [
    {
      id: "IOT-1001",
      type: "IoT Module",
      status: "Available",
      lastActive: "2 min ago",
      assignedTo: "-",
    },
    {
      id: "IOT-1002",
      type: "IoT Module",
      status: "Assigned",
      lastActive: "12 min ago",
      assignedTo: "SS-22001",
    },
    {
      id: "IOT-1003",
      type: "IoT Module",
      status: "Assigned",
      lastActive: "5 min ago",
      assignedTo: "SS-22002",
    },
    {
      id: "IOT-1004",
      type: "IoT Module",
      status: "Disabled",
      lastActive: "3 days ago",
      assignedTo: "-",
    },
  ];

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              IoT Sensor Center
            </h1>
            <p className="text-gray-600 text-sm">
              Admin has full control over IoT module inventory and assignments.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="customer-button bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Register New Device
            </button>
          </div>
        </div>

        <div className="customer-card bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-bold text-primary">Admin Controls</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="border border-slate-100 rounded-xl p-4 space-y-2 bg-slate-50/80">
              <p className="font-semibold">Register new IoT devices</p>
              <p className="text-gray-500">
                Add IoT modules (GPS + shock + temperature) into inventory.
              </p>
              <button className="text-primary font-semibold">
                Register Device
              </button>
            </div>
            <div className="border border-slate-100 rounded-xl p-4 space-y-2 bg-slate-50/80">
              <p className="font-semibold">Disable faulty devices</p>
              <p className="text-gray-500">
                Remove malfunctioning sensors from active assignments.
              </p>
              <button className="text-primary font-semibold">
                Disable Device
              </button>
            </div>
          </div>
        </div>

        <div className="customer-card bg-white p-6 rounded-xl shadow mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-bold text-primary">
              IoT Inventory List
            </h2>
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                Available
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                Assigned
              </span>
              <span className="px-3 py-1 rounded-full bg-red-50 text-red-700">
                Disabled
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Device ID</th>
                  <th className="py-2">Module</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Assigned To</th>
                  <th className="py-2">Last Active</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b">
                    <td className="py-3 font-semibold">{device.id}</td>
                    <td className="py-3">{device.type}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          device.status === "Available"
                            ? "bg-emerald-50 text-emerald-700"
                            : device.status === "Assigned"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="py-3">{device.assignedTo}</td>
                      <td className="py-3">{device.lastActive}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button className="text-red-600 font-semibold">
                            Disable
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
