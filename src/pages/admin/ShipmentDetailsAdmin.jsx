import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AdminTopbar from "./components/AdminTopbar";
const API_URL = import.meta.env.VITE_API_URL;

export default function ShipmentDetailsAdmin() {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const token = localStorage.getItem("token");

  const formatCategory = (value) => {
    const normalized = String(value || "").toLowerCase();
    if (!normalized) return "N/A";
    if (normalized === "linehaul") return "Linehaul Rider";
    if (normalized === "pickup") return "Pickup Rider";
    if (normalized === "delivery") return "Delivery Rider";
    return value;
  };

  useEffect(() => {
    let isMounted = true;

    const loadShipment = async () => {
      try {
        setLoadError("");
        setIsLoading(true);
        const endpoint = API_URL
          ? `${API_URL}/shipment/trackShipment/${id}`
          : `/trackShipment/${id}`;
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined;
        const res = await fetch(endpoint, { headers });
        const data = await res.json();

        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load shipment.");
        }
        console.log(data);
        if (isMounted) {
          const nextShipment = Array.isArray(data?.shipment)
            ? data.shipment[0]
            : data?.shipment || null;
          setShipment(nextShipment);
        }
      } catch (error) {
        if (isMounted)
          setLoadError(error?.message || "Unable to load shipment.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (id) {
      loadShipment();
    }

    return () => {
      isMounted = false;
    };
  }, [id, token]);

  const metaRows = useMemo(() => {
    if (!shipment) return [];
    return [
      { label: "Shipment ID", value: shipment?._id || id },
      { label: "User ID", value: shipment?.userId || "N/A" },
      { label: "Status", value: shipment?.status || "N/A" },
      { label: "Rider Status", value: shipment?.riderStatus || "N/A" },
      { label: "Package Type", value: shipment?.packageType || "N/A" },
      {
        label: "Weight",
        value:
          shipment?.weight !== undefined && shipment?.weight !== null
            ? `${shipment.weight}`
            : "N/A",
      },
      {
        label: "COD Amount",
        value:
          shipment?.codAmount !== undefined && shipment?.codAmount !== null
            ? `${shipment.codAmount}`
            : "N/A",
      },
      {
        label: "Delivery Charges",
        value:
          shipment?.delieveryCharges !== undefined &&
          shipment?.delieveryCharges !== null
            ? `${shipment.delieveryCharges}`
            : "N/A",
      },
      {
        label: "Use Wallet",
        value:
          shipment?.useWallet === true
            ? "Yes"
            : shipment?.useWallet === false
              ? "No"
              : "N/A",
      },
      {
        label: "Created At",
        value: shipment?.createdAt
          ? new Date(shipment.createdAt).toLocaleString()
          : "N/A",
      },
      {
        label: "Updated At",
        value: shipment?.updatedAt
          ? new Date(shipment.updatedAt).toLocaleString()
          : "N/A",
      },
    ];
  }, [shipment, id]);
  const alerts = useMemo(() => {
    if (!shipment) return [];
    if (Array.isArray(shipment?.alerts)) return shipment.alerts;
    if (Array.isArray(shipment?.alertHistory)) return shipment.alertHistory;
    if (Array.isArray(shipment?.iotAlerts)) return shipment.iotAlerts;
    return [];
  }, [shipment]);
  const timelineEntries = useMemo(() => {
    if (!shipment) return [];
    if (Array.isArray(shipment?.timeline)) return shipment.timeline;
    if (Array.isArray(shipment?.history)) return shipment.history;
    if (Array.isArray(shipment?.statusHistory)) return shipment.statusHistory;
    const entries = [];
    if (shipment?.createdAt) {
      entries.push({
        label: "Shipment Created",
        timestamp: shipment.createdAt,
      });
    }
    if (shipment?.status) {
      entries.push({
        label: `Current Status: ${shipment.status}`,
        timestamp: shipment.updatedAt || shipment.createdAt,
      });
    }
    if (
      shipment?.updatedAt &&
      shipment.updatedAt !== shipment.createdAt
    ) {
      entries.push({
        label: "Last Updated",
        timestamp: shipment.updatedAt,
      });
    }
    return entries;
  }, [shipment]);
  const riderAssignments = useMemo(() => {
    if (!shipment) return [];
    if (Array.isArray(shipment?.riderTasks) && shipment.riderTasks.length > 0) {
      return shipment.riderTasks;
    }
    if (shipment?.rider) {
      return [
        {
          rider: { name: shipment.rider },
          status: shipment?.riderStatus,
        },
      ];
    }
    return [];
  }, [shipment]);

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Shipment Details - {id}
        </h1>

        {isLoading ? (
          <div className="customer-card bg-white p-6 rounded-xl shadow text-sm text-gray-500">
            <span className="loading loading-spinner loading-sm" /> Loading
            shipment...
          </div>
        ) : loadError ? (
          <div className="customer-card bg-white p-6 rounded-xl shadow text-sm text-red-600">
            {loadError}
          </div>
        ) : shipment ? (
          <div className="space-y-8">
            <div className="customer-card bg-white p-6 shadow rounded-xl">
              <h2 className="text-xl font-bold text-primary mb-4">
                Live Map & Sensor Data
              </h2>

              <div className="relative w-full h-[420px] bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-500">
                Mapbox (Admin View)
                <div className="absolute top-6 left-6 bg-white shadow-xl px-5 py-3 rounded-xl border">
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="text-3xl font-bold text-red-600">--</p>
                </div>
                <div className="absolute top-6 right-6 bg-white shadow-xl px-5 py-3 rounded-xl border">
                  <p className="text-sm text-gray-600">Shock</p>
                  <p className="text-xl font-bold text-yellow-600">--</p>
                  <p className="text-xs text-gray-500">No data</p>
                </div>
                <div className="absolute bottom-6 right-6 bg-white shadow-xl px-5 py-3 rounded-xl border">
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="text-xl font-bold text-blue-600">--</p>
                </div>
              </div>
            </div>

            <div className="customer-card bg-white p-6 shadow rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-primary">
                    IoT Alerts
                  </h2>
                  <p className="text-sm text-gray-600">
                    Temperature, shock, and humidity breach notifications.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700">
                  {alerts.length} alert{alerts.length === 1 ? "" : "s"}
                </span>
              </div>

              {alerts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No alerts recorded for this shipment.
                </p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div
                      key={alert?.id || alert?._id || index}
                      className="border border-slate-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/70"
                    >
                      <div>
                        <p className="text-xs text-gray-500">
                          {alert?.time ||
                            alert?.timestamp ||
                            alert?.createdAt ||
                            "Timestamp unavailable"}
                        </p>
                        <p className="font-semibold text-slate-900">
                          {alert?.type || "Alert"}{" "}
                          {alert?.shipmentId ? `- ${alert.shipmentId}` : ""}
                        </p>
                        <p className="text-sm text-gray-600">
                          {alert?.message || alert?.note || "No details."}
                        </p>
                        {alert?.location ? (
                          <p className="text-xs text-gray-500">
                            {alert.location}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                        {alert?.severity || alert?.level || "Info"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {alerts.length > 0 && (
              <div className="customer-card bg-white p-6 shadow rounded-xl">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Alerts History
                </h2>
                <ul className="space-y-3 text-sm text-gray-700">
                  {alerts.map((alert, index) => (
                    <li
                      key={alert?.id || alert?._id || `history-${index}`}
                      className="border-l-4 border-primary/50 pl-4"
                    >
                      <p className="font-semibold">
                        {alert?.type || "Alert"}{" "}
                        {alert?.severity ? `(${alert.severity})` : ""}
                      </p>
                      <p className="text-gray-500">
                        {alert?.time ||
                          alert?.timestamp ||
                          alert?.createdAt ||
                          "Timestamp unavailable"}
                      </p>
                      <p>{alert?.message || alert?.note || "No details."}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="customer-card bg-white p-6 shadow rounded-xl">
              <h2 className="text-xl font-bold text-primary mb-4">
                Delivery Timeline
              </h2>
              {timelineEntries.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No timeline events recorded yet.
                </p>
              ) : (
                <ul className="space-y-4">
                  {timelineEntries.map((entry, index) => (
                    <li
                      key={entry?.id || entry?._id || `${entry?.label}-${index}`}
                      className="flex flex-col sm:flex-row sm:items-start gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-primary/80 mt-1" />
                        <p className="font-semibold text-gray-800">
                          {entry?.label || "Timeline update"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 sm:ml-auto">
                        {entry?.timestamp
                          ? new Date(entry.timestamp).toLocaleString()
                          : "Timestamp unavailable"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="customer-card bg-white p-6 shadow rounded-xl">
              <h2 className="text-xl font-bold text-primary mb-4">
                Shipment Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                {metaRows.map((row) => (
                  <p key={row.label}>
                    <strong>{row.label}:</strong> {row.value}
                  </p>
                ))}
              </div>
            </div>

            <div className="customer-card bg-white p-6 shadow rounded-xl">
              <h2 className="text-xl font-bold text-primary mb-4">
                Pickup Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <p>
                  <strong>Pickup Address:</strong>{" "}
                  {shipment?.pickupAddress || "N/A"}
                </p>
                <p>
                  <strong>Pickup City:</strong> {shipment?.pickupCity || "N/A"}
                </p>
                <p>
                  <strong>Pickup Zone:</strong> {shipment?.pickupZone || "N/A"}
                </p>
              </div>
            </div>

            <div className="customer-card bg-white p-6 shadow rounded-xl">
              <h2 className="text-xl font-bold text-primary mb-4">
                Delivery Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <p>
                  <strong>Receiver Name:</strong>{" "}
                  {shipment?.receiverName || "N/A"}
                </p>
                <p>
                  <strong>Receiver Phone:</strong>{" "}
                  {shipment?.receiverPhone || "N/A"}
                </p>
                <p>
                  <strong>Delivery Address:</strong>{" "}
                  {shipment?.deliveryAddress || "N/A"}
                </p>
                <p>
                  <strong>Delivery City:</strong>{" "}
                  {shipment?.deliveryCity || "N/A"}
                </p>
                <p>
                  <strong>Delivery Zone:</strong>{" "}
                  {shipment?.deliveryZone || "N/A"}
                </p>
                <p>
                  <strong>Notes:</strong> {shipment?.notes || "N/A"}
                </p>
              </div>
            </div>

            <div className="customer-card bg-white p-6 shadow rounded-xl">
              <h2 className="text-xl font-bold text-primary mb-4">
                Rider Information
              </h2>

              {riderAssignments.length === 0 ? (
                <p className="text-gray-500">No rider assigned.</p>
              ) : (
                <div className="space-y-4">
                  {riderAssignments.map((task, index) => {
                    const rider = task?.rider || {};
                    const riderId =
                      rider?._id || task?.riderId || task?.rider || "N/A";
                    return (
                      <div
                        key={task?._id || rider?._id || `rider-${index}`}
                        className="border border-slate-100 rounded-lg p-4 bg-slate-50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-primary">
                            {rider?.name || shipment?.rider || "Unknown Rider"}
                          </p>
                          <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                            {task?.status ||
                              shipment?.riderStatus ||
                              "Assigned"}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-gray-700 mt-3">
                          <p>
                            <strong>Rider ID:</strong> {riderId}
                          </p>
                          <p>
                            <strong>Phone:</strong> {rider?.phone || "N/A"}
                          </p>
                          <p>
                            <strong>Email:</strong> {rider?.email || "N/A"}
                          </p>
                          <p>
                            <strong>City:</strong>{" "}
                            {rider?.assignedCity || "N/A"}
                          </p>
                          <p>
                            <strong>Zone:</strong>{" "}
                            {rider?.assignedZone || "N/A"}
                          </p>
                          <p>
                            <strong>Category:</strong>{" "}
                            {formatCategory(rider?.riderCategory)}
                          </p>
                          {task?.assignedTime ? (
                            <p>
                              <strong>Assigned At:</strong>{" "}
                              {new Date(task.assignedTime).toLocaleString()}
                            </p>
                          ) : null}
                          {task?.completedTime ? (
                            <p>
                              <strong>Completed At:</strong>{" "}
                              {new Date(task.completedTime).toLocaleString()}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="customer-card bg-white p-6 rounded-xl shadow text-sm text-gray-500">
            Shipment not found.
          </div>
        )}
      </div>
    </div>
  );
}
