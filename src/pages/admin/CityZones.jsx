import { useEffect, useMemo, useState } from "react";
import AdminTopbar from "./components/AdminTopbar";
import { toastError, toastSuccess } from "../../utils/toast";

const API_URL = import.meta.env.VITE_API_URL;

const normalize = (value) => String(value || "").trim();

export default function CityZones() {
  const token = localStorage.getItem("token");
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [newCity, setNewCity] = useState("");
  const [newZones, setNewZones] = useState("");
  const [newActive, setNewActive] = useState(true);

  const [zoneInputs, setZoneInputs] = useState({});
  const [zoneAddLoading, setZoneAddLoading] = useState({});
  const [zoneRemoveLoading, setZoneRemoveLoading] = useState({});

  const loadCities = async () => {
    if (!token) {
      setError("Missing auth token.");
      setIsLoading(false);
      return;
    }
    try {
      setError("");
      const res = await fetch(`${API_URL}/admin/cities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to load cities.");
      }
      setCities(Array.isArray(data?.cities) ? data.cities : []);
      toastSuccess("Cities loaded.");
    } catch (err) {
      const message = err?.message || "Unable to load cities.";
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const sortedCities = useMemo(() => {
    return [...cities].sort((a, b) =>
      String(a.city || "").localeCompare(String(b.city || "")),
    );
  }, [cities]);

  const parseZones = (value) =>
    value
      .split(",")
      .map((item) => normalize(item))
      .filter(Boolean);

  const handleCreateCity = async () => {
    setMessage("");
    setError("");
    const cityValue = normalize(newCity);
    const zonesValue = parseZones(newZones);
    if (!cityValue) {
      setError("City name is required.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          city: cityValue,
          zones: zonesValue,
          active: newActive,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to create city.");
      }
      setCities((prev) => [...prev, data.city]);
      setNewCity("");
      setNewZones("");
      setNewActive(true);
      setMessage("City added successfully.");
      toastSuccess("City added successfully.");
    } catch (err) {
      const message = err?.message || "Unable to create city.";
      setError(message);
      toastError(message);
    }
  };

  const handleToggleActive = async (city) => {
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${API_URL}/admin/cities/${city._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !city.active }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to update city.");
      }
      setCities((prev) =>
        prev.map((item) => (item._id === city._id ? data.city : item)),
      );
      toastSuccess("City updated.");
    } catch (err) {
      const message = err?.message || "Unable to update city.";
      setError(message);
      toastError(message);
    }
  };

  const handleDeleteCity = async (cityId) => {
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${API_URL}/admin/cities/${cityId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to delete city.");
      }
      setCities((prev) => prev.filter((item) => item._id !== cityId));
      setMessage("City removed.");
      toastSuccess("City removed.");
    } catch (err) {
      const message = err?.message || "Unable to delete city.";
      setError(message);
      toastError(message);
    }
  };

  const handleZoneInput = (cityId, value) => {
    setZoneInputs((prev) => ({ ...prev, [cityId]: value }));
  };

  const handleAddZone = async (cityId) => {
    setMessage("");
    setError("");
    const zoneValue = normalize(zoneInputs[cityId]);
    if (!zoneValue) {
      setError("Zone name is required.");
      return;
    }
    if (zoneAddLoading[cityId]) return;

    try {
      setZoneAddLoading((prev) => ({ ...prev, [cityId]: true }));
      const res = await fetch(`${API_URL}/admin/cities/${cityId}/zones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ zone: zoneValue }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to add zone.");
      }
      setCities((prev) =>
        prev.map((item) => (item._id === cityId ? data.city : item)),
      );
      setZoneInputs((prev) => ({ ...prev, [cityId]: "" }));
      setMessage("Zone added.");
      toastSuccess("Zone added.");
    } catch (err) {
      const message = err?.message || "Unable to add zone.";
      setError(message);
      toastError(message);
    } finally {
      setZoneAddLoading((prev) => {
        const next = { ...prev };
        delete next[cityId];
        return next;
      });
    }
  };

  const handleRemoveZone = async (cityId, zone) => {
    setMessage("");
    setError("");
    const loadingKey = `${cityId}:${zone}`;
    if (zoneRemoveLoading[loadingKey]) return;
    try {
      setZoneRemoveLoading((prev) => ({ ...prev, [loadingKey]: true }));
      const res = await fetch(`${API_URL}/admin/cities/${cityId}/zones`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ zone }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to remove zone.");
      }
      setCities((prev) =>
        prev.map((item) => (item._id === cityId ? data.city : item)),
      );
      setMessage("Zone removed.");
      toastSuccess("Zone removed.");
    } catch (err) {
      const message = err?.message || "Unable to remove zone.";
      setError(message);
      toastError(message);
    } finally {
      setZoneRemoveLoading((prev) => {
        const next = { ...prev };
        delete next[loadingKey];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">Manage Cities</h1>
            <p className="text-gray-600">
              Add or remove service cities and zones for dispatch.
            </p>
          </div>
          <button
            type="button"
            onClick={loadCities}
            className="customer-button bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm hover:border-primary/40"
          >
            Refresh
          </button>
        </div>

        {(error || message) && (
          <div
            className={`customer-card bg-white rounded-xl p-4 text-sm ${
              error ? "text-red-600" : "text-green-600"
            }`}
          >
            {error || message}
          </div>
        )}

        <div className="customer-card bg-white shadow rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-primary">Add New City</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              City name
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="e.g. Karachi"
                className="customer-input border border-gray-300 rounded-lg px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700 md:col-span-2">
              Zones (comma separated)
              <input
                type="text"
                value={newZones}
                onChange={(e) => setNewZones(e.target.value)}
                placeholder="DHA, Clifton, Gulshan-e-Iqbal"
                className="customer-input border border-gray-300 rounded-lg px-3 py-2"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={newActive}
                onChange={(e) => setNewActive(e.target.checked)}
              />
              Active
            </label>
            <button
              type="button"
              onClick={handleCreateCity}
              className="customer-button bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add City
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {isLoading && (
            <div className="customer-card bg-white rounded-xl p-6 text-gray-500">
              Loading cities...
            </div>
          )}
          {!isLoading && sortedCities.length === 0 && (
            <div className="customer-card bg-white rounded-xl p-6 text-gray-500">
              No cities added yet.
            </div>
          )}
          {sortedCities.map((city) => (
            <div
              key={city._id}
              className="customer-card bg-white rounded-xl p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-primary">
                    {city.city}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {city.zones?.length || 0} zones
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(city)}
                    className={`customer-button px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      city.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {city.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCity(city._id)}
                    className="customer-button bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    Remove City
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(city.zones || []).map((zone) => (
                  <span
                    key={zone}
                    className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs"
                  >
                    {zone}
                    <button
                      type="button"
                      onClick={() => handleRemoveZone(city._id, zone)}
                      disabled={zoneRemoveLoading[`${city._id}:${zone}`]}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      {zoneRemoveLoading[`${city._id}:${zone}`]
                        ? "..."
                        : "✕"}
                    </button>
                  </span>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  value={zoneInputs[city._id] || ""}
                  onChange={(e) => handleZoneInput(city._id, e.target.value)}
                  placeholder="Add new zone"
                  className="customer-input border border-gray-300 rounded-lg px-3 py-2"
                  disabled={zoneAddLoading[city._id]}
                />
                <button
                  type="button"
                  onClick={() => handleAddZone(city._id)}
                  disabled={zoneAddLoading[city._id]}
                  className="customer-button bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {zoneAddLoading[city._id] ? "Adding..." : "Add Zone"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


