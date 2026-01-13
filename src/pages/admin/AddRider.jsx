import AdminTopbar from "./components/AdminTopbar";
import { useEffect, useMemo, useState } from "react";
import { toastError, toastSuccess } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function AddRider() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    assignedCity: "",
    riderCategory: "",
    assignedZone: "",
  });
  const [cityZones, setCityZones] = useState({});
  const [zonesError, setZonesError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const update = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
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

  const handleCreate = async () => {
    if (!token) {
      toastError("Missing admin token.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const endpoint = API_URL
        ? `${API_URL}/rider/addRider`
        : "/rider/addRider";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to create rider.");
      }
      toastSuccess(data?.message || "Rider created.");
      navigate("/admin/riders");
    } catch (error) {
      toastError(error?.message || "Unable to create rider.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div className="max-w-xl mx-auto w-full">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Add New Rider
          </h1>

          <div className="customer-card bg-white p-6 rounded-xl shadow space-y-6">
            {/* Rider Name */}
            <input
              type="text"
              name="name"
              placeholder="Rider Name"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              onChange={update}
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              onChange={update}
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              onChange={update}
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              onChange={update}
            />

            {/* Assigned City */}
            <select
              name="assignedCity"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={form.assignedCity}
              onChange={update}
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

            {/* Rider Category */}
            <select
              name="riderCategory"
              className="w-full px-4 py-3 border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={form.riderCategory}
              onChange={update}
            >
              <option value="">Select Rider Category</option>
              <option value="pickup">Pickup Rider</option>
              <option value="linehaul">Intercity Linehaul Rider</option>
              <option value="delivery">Delivery Rider</option>
            </select>

            {/* Assigned Zone (ONLY for pickup and delivery) */}
            {form.riderCategory !== "linehaul" && form.assignedCity && (
              <select
                name="assignedZone"
                className="w-full px-4 py-3 border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                value={form.assignedZone}
                onChange={update}
              >
                <option value="">Select Zone</option>
                {(cityZones[form.assignedCity] || []).map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            )}

            {/* Submit Button */}
            <button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="customer-button w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Rider Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
