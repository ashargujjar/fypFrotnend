import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function Riders() {
  const riders = [
    { id: "R-001", name: "Ali Raza", status: "Online", deliveries: 45 },
    { id: "R-002", name: "Umar Farooq", status: "Offline", deliveries: 81 },
  ];

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />
        <button
          onClick={() => (window.location.href = "/admin/riders/add")}
          className="mb-6 bg-primary text-white px-6 py-3 rounded-lg"
        >
          ➕ Add New Rider
        </button>

        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">Riders</h1>

          <div className="bg-white p-6 rounded-xl shadow">
            {riders.map((r) => (
              <div key={r.id} className="p-4 border-b">
                <p className="font-bold">{r.name}</p>
                <p className="text-sm text-gray-600">{r.status}</p>
                <p className="text-sm">Deliveries: {r.deliveries}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
