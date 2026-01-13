import { useEffect, useState } from "react";
import AdminTopbar from "./components/AdminTopbar";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const formatCategory = (value) => {
    const normalized = String(value || "").toLowerCase();
    if (!normalized) return "";
    if (normalized === "linehaul") return "Linehaul Rider";
    if (normalized === "pickup") return "Pickup Rider";
    if (normalized === "delivery") return "Delivery Rider";
    return value;
  };

  useEffect(() => {
    if (!token) {
      navigate("/login?role=admin");
      return;
    }

    let isMounted = true;

    const loadRiders = async () => {
      try {
        setLoadError("");
        setIsLoading(true);
        const res = await fetch(`${API_URL}/rider/getRiders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Unable to load riders.");
        }
        const list = Array.isArray(data?.riders)
          ? data.riders
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];
        const formatted = list.map((item, index) => ({
          id:
            item?._id ||
            item?.riderId ||
            `R-${String(index + 1).padStart(3, "0")}`,
          name: item?.name || item?.fullName || item?.username || "Unknown",
          city: item?.assignedCity || item?.city || "-",
          zone: item?.assignedZone || item?.zone || "",
          phone: item?.phone || item?.phoneNumber || "-",
          category: item?.riderCategory || item?.category || item?.type || "",
        }));
        if (isMounted) setRiders(formatted);
      } catch (error) {
        if (isMounted) setLoadError(error?.message || "Unable to load riders.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadRiders();
    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />
      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Rider Management
            </h1>
            <p className="text-gray-600 text-sm">
              Full control to add, edit, disable, or remove riders.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => (window.location.href = "/admin/riders/add")}
              className="customer-button bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Add New Rider
            </button>
          </div>
        </div>

        <div className="customer-card bg-white p-6 rounded-xl shadow space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="customer-card customer-card-soft rounded-xl p-4">
              <p className="text-xs text-gray-500">Total Riders</p>
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <p className="text-2xl font-bold text-primary">
                  {riders.length}
                </p>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="loading loading-spinner loading-sm" />
                Loading riders...
              </div>
            ) : loadError ? (
              <p className="text-sm text-red-600">{loadError}</p>
            ) : riders.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Rider</th>
                    <th className="py-2">City</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {riders?.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-3">
                        <p className="font-semibold text-primary">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.id}</p>
                        {r.category ? (
                          <p className="text-xs text-gray-500">
                            {formatCategory(r.category)}
                          </p>
                        ) : null}
                      </td>
                      <td className="py-3">
                        <p>{r.city}</p>
                        {r.zone ? (
                          <p className="text-xs text-gray-500">{r.zone}</p>
                        ) : null}
                      </td>
                      <td className="py-3">{r.phone}</td>
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
            ) : (
              <p className="text-sm text-gray-500">No riders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
