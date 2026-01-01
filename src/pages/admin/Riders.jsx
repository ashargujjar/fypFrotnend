import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function Riders() {
  const riders = [
    {
      id: "R-001",
      name: "Ali Raza",
      city: "Lahore",
      phone: "+92 300 1234567",
      deliveries: 45,
    },
    {
      id: "R-002",
      name: "Umar Farooq",
      city: "Karachi",
      phone: "+92 301 2223344",
      deliveries: 81,
    },
  ];

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />
        <div className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary">Rider Management</h1>
              <p className="text-gray-600 text-sm">
                Full control to add, edit, disable, or remove riders.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white border px-4 py-2 rounded-lg text-primary font-semibold hover:border-primary/40">
                Export List
              </button>
              <button
                onClick={() => (window.location.href = "/admin/riders/add")}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Add New Rider
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Total Riders</p>
                <p className="text-2xl font-bold text-primary">{riders.length}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Total Deliveries</p>
                <p className="text-2xl font-bold text-primary">
                  {riders.reduce((sum, r) => sum + r.deliveries, 0)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Rider</th>
                    <th className="py-2">City</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Deliveries</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-3">
                        <p className="font-semibold text-primary">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.id}</p>
                      </td>
                      <td className="py-3">{r.city}</td>
                      <td className="py-3">{r.phone}</td>
                      <td className="py-3">{r.deliveries}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button className="text-primary font-semibold">
                            Edit
                          </button>
                          <button className="text-amber-600 font-semibold">
                            Disable
                          </button>
                          <button className="text-red-600 font-semibold">
                            Remove
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
    </div>
  );
}
