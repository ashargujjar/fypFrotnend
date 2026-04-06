import { useEffect, useMemo, useState } from "react";
import Topbar from "./components/Topbar";
const API_URL = import.meta.env.VITE_API_URL;

const formatAlertType = (value) => {
  const type = String(value || "").toUpperCase();
  if (type === "TEMP_LOW") return "Temperature Low";
  if (type === "TEMP_HIGH") return "Temperature High";
  if (type === "SHOCK") return "Shock Detected";
  if (type === "BREACH") return "Breach Alert";
  return value || "Alert";
};

const formatAlertTime = (value) => {
  if (!value) return "Timestamp unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Timestamp unavailable";
  return date.toLocaleString();
};

export default function Alerts() {
  const token = localStorage.getItem("token");
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAlerts = async () => {
      if (!token) {
        if (isMounted) {
          setLoadError("Missing auth token.");
          setIsLoading(false);
        }
        return;
      }
      try {
        setLoadError("");
        setIsLoading(true);
        const endpoint = API_URL
          ? `${API_URL}/iot/alerts?limit=200`
          : "/iot/alerts?limit=200";
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load alerts.");
        }
        const list = Array.isArray(data?.alerts)
          ? data.alerts
          : Array.isArray(data)
            ? data
            : [];
        if (isMounted) setAlerts(list);
      } catch (error) {
        if (isMounted) setLoadError(error?.message || "Unable to load alerts.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAlerts();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const severityColor = (severity) => {
    const normalized = String(severity || "").toLowerCase();
    if (normalized === "high") return "bg-red-100 text-red-700";
    if (normalized === "medium") return "bg-yellow-100 text-yellow-700";
    if (normalized === "low") return "bg-gray-100 text-gray-700";
    return "bg-slate-100 text-slate-600";
  };

  const alertRows = useMemo(
    () =>
      alerts.map((alert) => ({
        id: alert?._id || alert?.id,
        type: formatAlertType(alert?.type),
        message: alert?.message || "No details.",
        shipmentId: alert?.shipmentId || "N/A",
        time: formatAlertTime(alert?.createdAt || alert?.timestamp),
        severity: String(alert?.severity || "Info"),
      })),
    [alerts],
  );

  return (
    <div className="min-h-screen bg-light customer-page">
      <Topbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Alerts Center
        </h1>

          <div className="customer-card bg-white p-6 shadow rounded-xl space-y-4">
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading alerts...</p>
            ) : loadError ? (
              <p className="text-sm text-red-600">{loadError}</p>
            ) : alertRows.length === 0 ? (
              <p className="text-sm text-gray-500">
                No alerts recorded for your shipments.
              </p>
            ) : (
              alertRows.map((a, index) => (
                <div
                  key={a.id || `${a.shipmentId}-${index}`}
                  className="border-b py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <h3 className="font-bold text-dark">{a.type}</h3>
                    <p className="text-gray-600 text-sm">{a.message}</p>
                    <p className="text-gray-400 text-xs">
                      Shipment: {a.shipmentId}
                    </p>
                    <p className="text-gray-400 text-xs">{a.time}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg font-semibold ${severityColor(a.severity)}`}
                  >
                    {a.severity}
                  </span>
                </div>
              ))
            )}
          </div>
      </div>
    </div>
  );
}
