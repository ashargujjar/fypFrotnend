import { useEffect, useMemo, useState } from "react";
import AdminTopbar from "./components/AdminTopbar";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [cityZones, setCityZones] = useState({});
  const [zonesError, setZonesError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    assignedCity: "",
    riderCategory: "",
    assignedZone: "",
  });
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
  const normalizeCategory = (value) => {
    const normalized = String(value || "").toLowerCase();
    if (!normalized) return "";
    if (normalized.includes("linehaul")) return "linehaul";
    if (normalized.includes("pickup")) return "pickup";
    if (normalized.includes("delivery")) return "delivery";
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
          email: item?.email || item?.userEmail || "",
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

  useEffect(() => {
    let isMounted = true;

    const loadZones = async () => {
      try {
        setZonesError("");
        const endpoint = API_URL ? `${API_URL}/user/zones` : "/user/zones";
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to load zones");
        }
        const data = await response.json();
        const zonesList = Array.isArray(data?.zones) ? data.zones : [];
        const nextZones = zonesList.reduce((acc, item) => {
          if (item?.active && item?.city && Array.isArray(item?.zones)) {
            acc[item.city] = item.zones;
          }
          return acc;
        }, {});

        if (isMounted) setCityZones(nextZones);
      } catch (error) {
        if (isMounted) setZonesError("Unable to load city zones.");
      }
    };

    loadZones();
    return () => {
      isMounted = false;
    };
  }, []);

  const cityOptions = useMemo(() => Object.keys(cityZones).sort(), [cityZones]);

  const openEdit = (rider) => {
    setEditForm({
      id: rider.id,
      name: rider.name || "",
      phone: rider.phone === "-" ? "" : rider.phone || "",
      email: rider.email || "",
      password: "",
      assignedCity: rider.city === "-" ? "" : rider.city || "",
      riderCategory: normalizeCategory(rider.category),
      assignedZone: rider.zone === "-" ? "" : rider.zone || "",
    });
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditForm({
      id: "",
      name: "",
      phone: "",
      email: "",
      password: "",
      assignedCity: "",
      riderCategory: "",
      assignedZone: "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "assignedCity") {
        next.assignedZone = "";
      }
      if (name === "riderCategory" && value === "linehaul") {
        next.assignedZone = "";
      }
      return next;
    });
  };

  const handleEditSave = () => {
    setRiders((prev) =>
      prev.map((r) =>
        r.id === editForm.id
          ? {
              ...r,
              name: editForm.name,
              phone: editForm.phone,
              email: editForm.email,
              city: editForm.assignedCity,
              zone: editForm.assignedZone,
              category: editForm.riderCategory,
            }
          : r
      )
    );
    closeEdit();
  };

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
              Full control to add, edit, or remove riders.
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
                          <button
                            type="button"
                            onClick={() => openEdit(r)}
                            className="text-primary font-semibold"
                          >
                            Edit
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

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="customer-card bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Edit Rider</h2>
              <button
                type="button"
                onClick={closeEdit}
                className="customer-button text-sm font-semibold text-gray-500 hover:text-primary"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4">
              <input
                type="text"
                name="name"
                placeholder="Rider Name"
                value={editForm.name}
                onChange={handleEditChange}
                className="customer-input w-full px-4 py-3 border rounded-lg outline-none focus:border-primary"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={editForm.phone}
                onChange={handleEditChange}
                className="customer-input w-full px-4 py-3 border rounded-lg outline-none focus:border-primary"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={editForm.email}
                onChange={handleEditChange}
                className="customer-input w-full px-4 py-3 border rounded-lg outline-none focus:border-primary"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={editForm.password}
                onChange={handleEditChange}
                className="customer-input w-full px-4 py-3 border rounded-lg outline-none focus:border-primary"
              />

              <select
                name="assignedCity"
                className="customer-input w-full px-4 py-3 border rounded-lg outline-none focus:border-primary"
                value={editForm.assignedCity}
                onChange={handleEditChange}
              >
                <option value="">Select City</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {zonesError ? (
                <p className="text-sm text-red-600">{zonesError}</p>
              ) : null}

              <select
                name="riderCategory"
                className="customer-input w-full px-4 py-3 border rounded-lg outline-none focus:border-primary"
                value={editForm.riderCategory}
                onChange={handleEditChange}
              >
                <option value="">Select Rider Category</option>
                <option value="pickup">Pickup Rider</option>
                <option value="linehaul">Intercity Linehaul Rider</option>
                <option value="delivery">Delivery Rider</option>
              </select>

              {editForm.riderCategory !== "linehaul" &&
                editForm.assignedCity && (
                  <select
                    name="assignedZone"
                    className="customer-input w-full px-4 py-3 border rounded-lg outline-none focus:border-primary"
                    value={editForm.assignedZone}
                    onChange={handleEditChange}
                  >
                    <option value="">Select Zone</option>
                    {(cityZones[editForm.assignedCity] || []).map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                )}
            </div>

            <div className="flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={closeEdit}
                className="customer-button bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:border-primary/40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditSave}
                className="customer-button bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
