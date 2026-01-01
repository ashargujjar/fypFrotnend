import Topbar from "./components/Topbar";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function MyShipments() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const token = localStorage.getItem("token");

  const getStatusColor = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-700";
    if (status === "In Transit") return "bg-yellow-100 text-yellow-700";
    if (status === "Alert") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatLocation = (shipment) => {
    const parts = [
      shipment?.deliveryAddress,
      shipment?.deliveryZone,
      shipment?.deliveryCity,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "-";
  };

  useEffect(() => {
    let isMounted = true;

    const loadShipments = async () => {
      try {
        setLoadError("");
        const res = await fetch(`${API_URL}/shipment/getShipments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Unable to load shipments.");
        }
        const list = Array.isArray(data?.shipments)
          ? data.shipments
          : Array.isArray(data)
            ? data
            : [];
        if (isMounted) setShipments(list);
      } catch (error) {
        if (isMounted)
          setLoadError(error?.message || "Unable to load shipments.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (token) {
      loadShipments();
    } else {
      setLoadError("Missing auth token.");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-light">
      <Topbar />

      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">My Shipments</h1>

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search shipment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white border w-full md:w-1/3 outline-none focus:border-primary"
            />

            {/* Status Filter */}
            <select className="px-4 py-3 rounded-lg bg-white border outline-none focus:border-primary">
              <option>Status: All</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Alert</option>
            </select>

            {/* Sorting */}
            <select
              className="px-4 py-3 rounded-lg bg-white border outline-none focus:border-primary"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date_desc">Date: Newest</option>
              <option value="date_asc">Date: Oldest</option>
              <option value="status_asc">Status: A-Z</option>
              <option value="status_desc">Status: Z-A</option>
            </select>
          </div>

          {/* Shipments Table */}
          <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="loading loading-spinner loading-sm" />
                Loading shipments...
              </div>
            ) : loadError ? (
              <p className="text-sm text-red-600">{loadError}</p>
            ) : (
              <table className="w-full text-left min-w-[720px]">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-3">Shipment ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Location</th>
                  </tr>
                </thead>

                <tbody>
                  {shipments
                    .filter((s) =>
                      String(s.id || s._id || "")
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .sort((a, b) => {
                      if (sortBy === "date_asc" || sortBy === "date_desc") {
                        const aTime = new Date(a.createdAt || 0).getTime();
                        const bTime = new Date(b.createdAt || 0).getTime();
                        return sortBy === "date_asc" ? aTime - bTime : bTime - aTime;
                      }
                      const aStatus = (a.status || "").toLowerCase();
                      const bStatus = (b.status || "").toLowerCase();
                      const cmp = aStatus.localeCompare(bStatus);
                      return sortBy === "status_desc" ? -cmp : cmp;
                    })
                    .map((s) => (
                      <tr
                        key={s.id || s._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3 font-semibold text-primary">
                          {s.id || s._id}
                        </td>
                        <td className="p-3">{formatDate(s.createdAt)}</td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(
                              s.status
                            )}`}
                          >
                            {s.status || "Pending"}
                          </span>
                        </td>

                        <td className="p-3">{formatLocation(s)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-6 space-x-2">
            <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100">
              Prev
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100">
              2
            </button>
            <button className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100">
              Next
            </button>
          </div>
      </div>
    </div>
  );
}
