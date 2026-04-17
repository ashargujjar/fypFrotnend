import { useEffect, useState } from "react";
import AdminTopbar from "./components/AdminTopbar";
import { toastError, toastSuccess } from "../../utils/toast";

const API_URL = import.meta.env.VITE_API_URL;

const normalize = (value) => String(value || "").trim();
const normalizeKey = (value) => normalize(value).toLowerCase();

export default function DeliveryRates() {
  const token = localStorage.getItem("token");
  const [perKgRate, setPerKgRate] = useState("0");
  const [intercityFixedRate, setIntercityFixedRate] = useState("0");
  const [cityRates, setCityRates] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingBase, setIsSavingBase] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [newFromCity, setNewFromCity] = useState("");
  const [newToCity, setNewToCity] = useState("");
  const [newRate, setNewRate] = useState("");

  const loadRates = async () => {
    if (!token) {
      setError("Missing auth token.");
      setIsLoading(false);
      return;
    }
    try {
      setError("");
      setMessage("");
      const res = await fetch(`${API_URL}/admin/rates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to load rates.");
      }
      const rates = data?.rates || {};
      setPerKgRate(String(rates.perKgRate ?? 0));
      setIntercityFixedRate(String(rates.intercityFixedRate ?? 0));
      setCityRates(
        Array.isArray(rates.cityToCityRates) ? rates.cityToCityRates : [],
      );
      setLastUpdated(
        rates.updatedAt ? new Date(rates.updatedAt).toLocaleString() : "",
      );
      toastSuccess("Rates loaded.");
    } catch (err) {
      const message = err?.message || "Unable to load rates.";
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleAddCityRate = () => {
    setError("");
    setMessage("");
    const fromCity = normalize(newFromCity);
    const toCity = normalize(newToCity);
    const rateValue = Number(newRate);
    if (!fromCity || !toCity) {
      setError("From city and to city are required.");
      return;
    }
    if (Number.isNaN(rateValue) || rateValue < 0) {
      setError("Rate must be a non-negative number.");
      return;
    }
    setCityRates((prev) => {
      const fromKey = normalizeKey(fromCity);
      const toKey = normalizeKey(toCity);
      const existingIndex = prev.findIndex(
        (entry) =>
          normalizeKey(entry.fromCity) === fromKey &&
          normalizeKey(entry.toCity) === toKey,
      );
      if (existingIndex >= 0) {
        return prev.map((entry, index) =>
          index === existingIndex ? { ...entry, rate: rateValue } : entry,
        );
      }
      return [...prev, { fromCity, toCity, rate: rateValue }];
    });
    setNewFromCity("");
    setNewToCity("");
    setNewRate("");
    setMessage("City rate saved locally. Save changes to apply.");
  };

  const handleUpdateEntry = (index, field, value) => {
    setCityRates((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const handleRemoveEntry = (index) => {
    setCityRates((prev) => prev.filter((_, i) => i !== index));
  };

  const validatePayload = (payload) => {
    if (Number.isNaN(payload.perKgRate) || payload.perKgRate < 0) {
      return "Per Kg rate must be a non-negative number.";
    }
    if (
      Number.isNaN(payload.intercityFixedRate) ||
      payload.intercityFixedRate < 0
    ) {
      return "Intercity fixed rate must be a non-negative number.";
    }
    for (const entry of payload.cityToCityRates) {
      if (!entry.fromCity || !entry.toCity) {
        return "Each city rate needs a from city and to city.";
      }
      if (Number.isNaN(entry.rate) || entry.rate < 0) {
        return "Each city rate needs a non-negative rate.";
      }
    }
    return "";
  };

  const validateBasePayload = (payload) => {
    if (Number.isNaN(payload.perKgRate) || payload.perKgRate < 0) {
      return "Per Kg rate must be a non-negative number.";
    }
    if (
      Number.isNaN(payload.intercityFixedRate) ||
      payload.intercityFixedRate < 0
    ) {
      return "Intercity fixed rate must be a non-negative number.";
    }
    return "";
  };

  const handleSaveBaseRates = async () => {
    if (!token) {
      setError("Missing auth token.");
      return;
    }
    setError("");
    setMessage("");
    const payload = {
      perKgRate: Number(perKgRate),
      intercityFixedRate: Number(intercityFixedRate),
    };
    const validationError = validateBasePayload(payload);
    if (validationError) {
      setError(validationError);
      toastError(validationError);
      return;
    }
    if (isSavingBase) return;
    try {
      setIsSavingBase(true);
      const res = await fetch(`${API_URL}/admin/rates`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to save base rates.");
      }
      const rates = data?.rates || payload;
      setPerKgRate(String(rates.perKgRate ?? payload.perKgRate));
      setIntercityFixedRate(
        String(rates.intercityFixedRate ?? payload.intercityFixedRate),
      );
      setLastUpdated(
        rates.updatedAt ? new Date(rates.updatedAt).toLocaleString() : "",
      );
      setMessage("Base rates saved successfully.");
      toastSuccess("Base rates saved.");
    } catch (err) {
      const message = err?.message || "Unable to save base rates.";
      setError(message);
      toastError(message);
    } finally {
      setIsSavingBase(false);
    }
  };

  const handleSaveRates = async () => {
    if (!token) {
      setError("Missing auth token.");
      return;
    }
    setError("");
    setMessage("");
    const payload = {
      perKgRate: Number(perKgRate),
      intercityFixedRate: Number(intercityFixedRate),
      cityToCityRates: cityRates.map((entry) => ({
        fromCity: normalize(entry.fromCity),
        toCity: normalize(entry.toCity),
        rate: Number(entry.rate),
      })),
    };
    const validationError = validatePayload(payload);
    if (validationError) {
      setError(validationError);
      toastError(validationError);
      return;
    }

    if (isSaving) return;
    try {
      setIsSaving(true);
      const res = await fetch(`${API_URL}/admin/rates`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to save rates.");
      }
      const rates = data?.rates || payload;
      setPerKgRate(String(rates.perKgRate ?? payload.perKgRate));
      setIntercityFixedRate(
        String(rates.intercityFixedRate ?? payload.intercityFixedRate),
      );
      setCityRates(
        Array.isArray(rates.cityToCityRates)
          ? rates.cityToCityRates
          : payload.cityToCityRates,
      );
      setLastUpdated(
        rates.updatedAt ? new Date(rates.updatedAt).toLocaleString() : "",
      );
      setMessage("Rates saved successfully.");
      toastSuccess("Rates saved successfully.");
    } catch (err) {
      const message = err?.message || "Unable to save rates.";
      setError(message);
      toastError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Delivery Rate Management
            </h1>
            <p className="text-gray-600">
              Update base pricing and city-to-city delivery rates.
            </p>
            {lastUpdated && (
              <p className="text-xs text-slate-400 mt-1">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={loadRates}
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

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="customer-card bg-white shadow rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-semibold text-primary">Base Rates</h2>
            <div className="grid gap-4">
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Per Kg rate (PKR)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={perKgRate}
                  onChange={(e) => setPerKgRate(e.target.value)}
                  className="customer-input border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Intercity fixed rate (PKR)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={intercityFixedRate}
                  onChange={(e) => setIntercityFixedRate(e.target.value)}
                  className="customer-input border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Intercity fixed rate applies only when no city-to-city rate is
              defined for the route.
            </p>
            <p className="text-xs text-gray-500">
              Intra-city deliveries use the per Kg rate only.
            </p>
            <p className="text-xs text-gray-500">
              City names are normalized to lowercase on save.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveBaseRates}
                disabled={isSavingBase}
                className="customer-button bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSavingBase ? "Saving..." : "Save Base Rates"}
              </button>
            </div>
          </div>

          <div className="customer-card bg-white shadow rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-semibold text-primary">
              Add City-to-City Rate
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                From city
                <input
                  type="text"
                  value={newFromCity}
                  onChange={(e) => setNewFromCity(e.target.value)}
                  placeholder="Karachi"
                  className="customer-input border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                To city
                <input
                  type="text"
                  value={newToCity}
                  onChange={(e) => setNewToCity(e.target.value)}
                  placeholder="Lahore"
                  className="customer-input border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Rate (PKR)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  placeholder="250"
                  className="customer-input border border-gray-300 rounded-lg px-3 py-2"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={handleAddCityRate}
              className="customer-button bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Rate
            </button>
          </div>
        </div>

        <div className="customer-card bg-white shadow rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-primary">
                City-to-City Rates
              </h2>
              <p className="text-sm text-gray-500">
                Update rates inline and remove any obsolete routes.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveRates}
              disabled={isSaving}
              className="customer-button bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save All Rates"}
            </button>
          </div>

          {isLoading && (
            <div className="text-sm text-gray-500">Loading rates...</div>
          )}
          {!isLoading && cityRates.length === 0 && (
            <div className="text-sm text-gray-500">
              No city-to-city rates added yet.
            </div>
          )}

          <div className="grid gap-3">
            {cityRates.map((entry, index) => (
              <div
                key={`${entry.fromCity}-${entry.toCity}-${index}`}
                className="grid gap-3 sm:grid-cols-4 items-end"
              >
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                  From city
                  <input
                    type="text"
                    value={entry.fromCity}
                    onChange={(e) =>
                      handleUpdateEntry(index, "fromCity", e.target.value)
                    }
                    className="customer-input border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                  To city
                  <input
                    type="text"
                    value={entry.toCity}
                    onChange={(e) =>
                      handleUpdateEntry(index, "toCity", e.target.value)
                    }
                    className="customer-input border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-gray-600">
                  Rate (PKR)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={entry.rate}
                    onChange={(e) =>
                      handleUpdateEntry(index, "rate", e.target.value)
                    }
                    className="customer-input border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveEntry(index)}
                  className="customer-button bg-rose-100 text-rose-700 px-3 py-2 rounded-lg text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
