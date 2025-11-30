import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function Shipments() {
  const shipments = [
    {
      id: "SS-1012",
      partner: "TechCart",
      status: "In Transit",
      origin: "Lahore",
      dest: "Islamabad",
      rider: "Ali Raza",
    },
    {
      id: "SS-1090",
      partner: "MegaMart",
      status: "Delivered",
      origin: "Karachi",
      dest: "Sialkot",
      rider: "Umar Farooq",
    },
  ];

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Manage Shipments
          </h1>

          <div className="bg-white p-6 shadow rounded-xl overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600">
                  <th className="p-3">ID</th>
                  <th className="p-3">Partner</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Origin</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Rider</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {shipments.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{s.id}</td>
                    <td className="p-3">{s.partner}</td>
                    <td className="p-3">{s.status}</td>
                    <td className="p-3">{s.origin}</td>
                    <td className="p-3">{s.dest}</td>
                    <td className="p-3">{s.rider}</td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          (window.location.href = `/admin/shipments/${s.id}`)
                        }
                        className="text-primary font-semibold"
                      >
                        View
                      </button>
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
