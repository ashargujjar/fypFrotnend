import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatsCard from "./components/StatsCard";

export default function DashboardHome() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Area */}
      <div className="flex-1">
        {/* Top Bar */}
        <Topbar />

        {/* CONTENT */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatsCard title="Active Shipments" value="3" icon="AS" />
            <StatsCard title="Delivered" value="12" icon="DL" />
            <StatsCard title="Alerts" value="1" icon="AL" />
            <StatsCard title="Payments" value="5" icon="PM" />
          </div>

          {/* Live Shipments Table */}
          <div className="mt-10 bg-white shadow rounded-xl p-6">
            <h3 className="text-xl font-bold text-primary mb-4">
              Live Shipments
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[560px]">
                <thead>
                  <tr className="bg-light text-gray-600">
                    <th className="p-3">ID</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">ETA</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="p-3">SS-1012</td>
                    <td className="p-3 text-yellow-600 font-semibold">
                      In Transit
                    </td>
                    <td className="p-3">Rawalpindi</td>
                    <td className="p-3">2 hrs</td>
                  </tr>

                  <tr className="border-b">
                    <td className="p-3">SS-1090</td>
                    <td className="p-3 text-green-600 font-semibold">
                      Delivered
                    </td>
                    <td className="p-3">Islamabad</td>
                    <td className="p-3">Delivered</td>
                  </tr>

                  <tr>
                    <td className="p-3">SS-1121</td>
                    <td className="p-3 text-red-600 font-semibold">
                      Temperature Alert
                    </td>
                    <td className="p-3">Lahore</td>
                    <td className="p-3">Unknown</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-10 bg-white shadow rounded-xl p-6">
            <h3 className="text-xl font-bold text-primary mb-4">
              Live Map Tracking
            </h3>
            <div className="w-full h-72 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
              Mapbox Integration Coming Here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
