import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function AdminDashboardHome() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            System Overview
          </h1>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Shipments" value="1240" icon="TS" />
            <StatCard title="Active Shipments" value="89" icon="AS" />
            <StatCard title="Delivered Today" value="57" icon="DT" />
            <StatCard title="Customers" value="42" icon="C" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow rounded-xl lg:col-span-2">
              <h2 className="text-xl font-bold text-primary mb-4">Live Map</h2>
              <div className="w-full h-[350px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                Map Coming Soon...
              </div>
            </div>

            <div className="bg-white p-6 shadow rounded-xl">
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
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
