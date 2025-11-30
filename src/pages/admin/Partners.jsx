import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function Partners() {
  const partners = [
    { name: "TechCart", shipments: 400 },
    { name: "StyleStore", shipments: 220 },
  ];

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">Partners</h1>

          <div className="bg-white p-6 rounded-xl shadow">
            {partners.map((p) => (
              <div key={p.name} className="p-4 border-b">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-gray-500">{p.shipments} shipments</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
