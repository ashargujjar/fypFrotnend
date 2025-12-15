import { useMemo, useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function Shipments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");

  const shipments = [
    {
      id: "SS-1012",
      status: "In Transit",
      origin: "Lahore",
      dest: "Islamabad",
      rider: "Ali Raza",
    },
    {
      id: "SS-1090",
      status: "Delivered",
      origin: "Karachi",
      dest: "Sialkot",
      rider: "Umar Farooq",
    },
  ];

  const filteredAndSortedShipments = useMemo(() => {
    const filtered = shipments.filter((s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!sortField) return filtered;

    return [...filtered].sort((a, b) =>
      (a[sortField] || "").localeCompare(b[sortField] || "")
    );
  }, [searchTerm, sortField]);

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by Shipment ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">None</option>
                  <option value="origin">Origin</option>
                  <option value="status">Status</option>
                  <option value="dest">Destination</option>
                  <option value="rider">Rider</option>
                </select>
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600">
                  <th className="p-3">ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Origin</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Rider</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAndSortedShipments.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{s.id}</td>
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
