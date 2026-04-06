import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Topbar from "./components/Topbar";

const API_URL = import.meta.env.VITE_API_URL;
const MAPBOX_TOKEN = import.meta.env.VITE_MAP_BOX_TOKEN;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const customerIcon = L.divIcon({
  className: "route-marker",
  html: `<div style="background:#16a34a;color:#fff;width:28px;height:28px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #fff;box-shadow:0 8px 16px rgba(15,23,42,0.25);">C</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -24],
});

const deviceIcon = L.divIcon({
  className: "route-marker",
  html: `<div style="background:#2563eb;color:#fff;width:28px;height:28px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #fff;box-shadow:0 8px 16px rgba(15,23,42,0.25);">I</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -24],
});


const formatCategory = (value) => {
  const normalized = String(value || "").toLowerCase();
  if (!normalized) return "N/A";
  if (normalized === "linehaul") return "Linehaul Rider";
  if (normalized === "pickup") return "Pickup Rider";
  if (normalized === "delivery") return "Delivery Rider";
  return value;
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
};

const formatTemperatureUnit = (unit) =>
  unit === "C" ? "\u00b0C" : unit || "\u00b0C";

const formatTempBand = (minTemp, maxTemp) => {
  if (minTemp === null || minTemp === undefined) return "Target band not set";
  if (maxTemp === null || maxTemp === undefined) return "Target band not set";
  return `Target band ${minTemp}\u00b0C - ${maxTemp}\u00b0C`;
};

const formatDistance = (meters = 0) => {
  if (!meters) return "--";
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

const formatDuration = (seconds = 0) => {
  if (!seconds) return "--";
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const fetchEta = async (start, end) => {
  if (!MAPBOX_TOKEN) {
    throw new Error("Missing Mapbox token.");
  }
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Unable to fetch ETA.");
  }
  const data = await res.json();
  const route = data?.routes?.[0];
  if (!route) {
    throw new Error("No route found.");
  }
  return { distance: route.distance, duration: route.duration };
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};


export default function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [shipment, setShipment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isListLoading, setIsListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [telemetry, setTelemetry] = useState([]);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(false);
  const [telemetryError, setTelemetryError] = useState("");
  const [iotAlerts, setIotAlerts] = useState([]);
  const [isAlertsLoading, setIsAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState("");
  const [etaInfo, setEtaInfo] = useState(null);
  const [etaError, setEtaError] = useState("");
  const token = localStorage.getItem("token");

  const shipmentId = shipment?._id || shipment?.id || id || "";
  const latestTelemetry = useMemo(() => {
    if (!Array.isArray(telemetry) || telemetry.length === 0) return null;
    return telemetry[0];
  }, [telemetry]);
  const temperatureValue =
    latestTelemetry?.temperature ??
    shipment?.temperature?.current ??
    shipment?.temperature?.value ??
    shipment?.temperature ??
    null;
  const temperatureUnit = formatTemperatureUnit(shipment?.temperature?.unit);
  const parcelValue =
    shipment?.codAmount !== undefined && shipment?.codAmount !== null
      ? shipment.codAmount
      : null;
  const telemetryTimestamp =
    latestTelemetry?.recordedAt || latestTelemetry?.createdAt || null;

  const deviceCoords = useMemo(() => {
    const lat = toNumber(latestTelemetry?.latitude);
    const lng = toNumber(latestTelemetry?.longitude);
    if (lat === null || lng === null) return null;
    return { lat, lng, label: "IoT device location" };
  }, [latestTelemetry]);

  const customerCoords = useMemo(() => {
    const deliveryLat = toNumber(shipment?.deliveryLat);
    const deliveryLng = toNumber(shipment?.deliveryLng);
    if (deliveryLat !== null && deliveryLng !== null) {
      return {
        lat: deliveryLat,
        lng: deliveryLng,
        label: "Customer delivery location",
      };
    }
    const pickupLat = toNumber(shipment?.pickupLat);
    const pickupLng = toNumber(shipment?.pickupLng);
    if (pickupLat !== null && pickupLng !== null) {
      return {
        lat: pickupLat,
        lng: pickupLng,
        label: "Customer pickup location",
      };
    }
    return null;
  }, [shipment]);

  const mapCenter = useMemo(() => {
    if (deviceCoords) return deviceCoords;
    if (customerCoords) return customerCoords;
    return { lat: 30.3753, lng: 69.3451 };
  }, [deviceCoords, customerCoords]);

  const mapPoints = useMemo(() => {
    const points = [];
    if (customerCoords) points.push([customerCoords.lat, customerCoords.lng]);
    if (deviceCoords) points.push([deviceCoords.lat, deviceCoords.lng]);
    return points;
  }, [customerCoords, deviceCoords]);

  useEffect(() => {
    let isMounted = true;

    const loadShipments = async () => {
      if (!token) {
        if (isMounted) {
          setListError("Missing auth token.");
          setIsListLoading(false);
        }
        return;
      }

      try {
        setIsListLoading(true);
        setListError("");
        const endpoint = API_URL
          ? `${API_URL}/shipment/getShipments`
          : "/shipment/getShipments";
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
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
          setListError(error?.message || "Unable to load shipments.");
      } finally {
        if (isMounted) setIsListLoading(false);
      }
    };

    loadShipments();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    let isMounted = true;

    const loadShipment = async () => {
      if (!token) {
        if (isMounted) {
          setLoadError("Missing auth token.");
          setIsLoading(false);
        }
        return;
      }
      if (!id) {
        if (isMounted) {
          setShipment(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        setLoadError("");
        setIsLoading(true);
        const endpoint = API_URL
          ? `${API_URL}/shipment/trackShipment/${id}`
          : `/shipment/trackShipment/${id}`;
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load shipment.");
        }
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

    loadShipment();

    return () => {
      isMounted = false;
    };
  }, [id, token]);

  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    const loadTelemetry = async () => {
      if (!token) {
        if (isMounted) {
          setTelemetryError("Missing auth token.");
          setTelemetry([]);
        }
        return;
      }
      if (!shipmentId) {
        if (isMounted) {
          setTelemetryError("");
          setTelemetry([]);
        }
        return;
      }

      try {
        setTelemetryError("");
        setIsTelemetryLoading(true);
        const endpoint = API_URL
          ? `${API_URL}/iot/telemetry/${shipmentId}?limit=1`
          : `/iot/telemetry/${shipmentId}?limit=1`;
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        if (res.status == 304) {
          return;
        }
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load telemetry.");
        }
        const list = Array.isArray(data?.telemetry)
          ? data.telemetry
          : Array.isArray(data)
            ? data
            : [];
        if (isMounted) setTelemetry(list);
      } catch (error) {
        if (isMounted)
          setTelemetryError(error?.message || "Unable to load telemetry.");
      } finally {
        if (isMounted) setIsTelemetryLoading(false);
      }
    };

    loadTelemetry();
    intervalId = setInterval(loadTelemetry, 30000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [shipmentId, token]);

  useEffect(() => {
    let isMounted = true;

    const loadEta = async () => {
      if (!deviceCoords || !customerCoords || !MAPBOX_TOKEN) {
        if (isMounted) {
          setEtaInfo(null);
          setEtaError("");
        }
        return;
      }

      try {
        setEtaError("");
        const data = await fetchEta(deviceCoords, customerCoords);
        if (isMounted) setEtaInfo(data);
      } catch (error) {
        if (isMounted) {
          setEtaInfo(null);
          setEtaError(error?.message || "Unable to fetch ETA.");
        }
      }
    };

    loadEta();

    return () => {
      isMounted = false;
    };
  }, [deviceCoords, customerCoords]);
  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    const loadAlerts = async () => {
      if (!token || !shipmentId) {
        if (isMounted) {
          setIotAlerts([]);
          setAlertsError("");
          setIsAlertsLoading(false);
        }
        return;
      }
      try {
        setAlertsError("");
        setIsAlertsLoading(true);
        const endpoint = API_URL
          ? `${API_URL}/iot/alerts/${shipmentId}`
          : `/iot/alerts/${shipmentId}`;
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        if (res.status == 304) {
          return;
        }
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load IoT alerts.");
        }
        const list = Array.isArray(data?.alerts)
          ? data.alerts
          : Array.isArray(data)
            ? data
            : [];
        if (isMounted) setIotAlerts(list);
      } catch (error) {
        if (isMounted)
          setAlertsError(error?.message || "Unable to load IoT alerts.");
      } finally {
        if (isMounted) setIsAlertsLoading(false);
      }
    };

    loadAlerts();
    intervalId = setInterval(loadAlerts, 30000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [shipmentId, token]);

  const alerts = useMemo(() => {
    if (Array.isArray(iotAlerts) && iotAlerts.length > 0) return iotAlerts;
    if (!shipment) return [];
    if (Array.isArray(shipment?.alerts)) return shipment.alerts;
    if (Array.isArray(shipment?.alertHistory)) return shipment.alertHistory;
    if (Array.isArray(shipment?.iotAlerts)) return shipment.iotAlerts;
    return [];
  }, [shipment, iotAlerts]);

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
    if (shipment?.updatedAt && shipment.updatedAt !== shipment.createdAt) {
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

  const metaRows = useMemo(() => {
    if (!shipment) return [];
    return [
      { label: "Shipment ID", value: shipment?._id || id },
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
        label: "Min Temp",
        value:
          shipment?.minTemp !== undefined && shipment?.minTemp !== null
            ? `${shipment.minTemp}`
            : "N/A",
      },
      {
        label: "Max Temp",
        value:
          shipment?.maxTemp !== undefined && shipment?.maxTemp !== null
            ? `${shipment.maxTemp}`
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
        label: "IoT Device ID",
        value: shipment?.iotDeviceId || "N/A",
      },
      {
        label: "IoT Status",
        value: shipment?.iotStatus || "N/A",
      },
      {
        label: "Created At",
        value: formatDateTime(shipment?.createdAt),
      },
      {
        label: "Updated At",
        value: formatDateTime(shipment?.updatedAt),
      },
    ];
  }, [shipment, id]);

  const handleSelectShipment = (event) => {
    const nextId = event.target.value;
    if (nextId) {
      navigate(`/customer/shipments/${nextId}`);
    }
  };

  return (
    <div className="min-h-screen bg-light customer-page">
      <Topbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-500">
            Select a shipment to view its details, telemetry, and IoT history.
          </p>

          <select
            value={shipmentId}
            onChange={handleSelectShipment}
            className="customer-input px-4 py-3 rounded-lg bg-white border outline-none focus:border-primary"
          >
            <option value="" disabled>
              {isListLoading ? "Loading shipments..." : "Select shipment"}
            </option>
            {shipments.map((item) => {
              const optionId = item?._id || item?.id;
              if (!optionId) return null;
              return (
                <option key={optionId} value={optionId}>
                  {optionId} ({item?.status || "Pending"})
                </option>
              );
            })}
          </select>
        </div>

        {listError ? (
          <div className="customer-card bg-white p-4 rounded-xl shadow text-sm text-red-600 mb-6">
            {listError}
          </div>
        ) : null}

        <h1 className="text-2xl font-bold text-primary mb-6">
          Shipment Details {shipmentId ? `- ${shipmentId}` : ""}
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

              {!MAPBOX_TOKEN ? (
                <div className="w-full h-[420px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm px-6 text-center">
                  Mapbox token missing. Add `VITE_MAP_BOX_TOKEN` to show the live
                  map.
                </div>
              ) : (
                <div className="relative w-full h-[420px] bg-gray-200 rounded-xl overflow-hidden">
                  {mapPoints.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm px-6 text-center">
                      No coordinates available yet for the customer or the IoT
                      device.
                    </div>
                  ) : (
                    <MapContainer
                      center={[mapCenter.lat, mapCenter.lng]}
                      zoom={12}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution="&copy; Mapbox &copy; OpenStreetMap"
                        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
                        tileSize={512}
                        zoomOffset={-1}
                      />
                      {mapPoints.length > 0 && <FitBounds points={mapPoints} />}
                      {customerCoords && (
                        <Marker
                          position={[customerCoords.lat, customerCoords.lng]}
                          icon={customerIcon}
                        >
                          <Popup>
                            {customerCoords.label || "Customer location"}
                          </Popup>
                        </Marker>
                      )}
                      {deviceCoords && (
                        <Marker
                          position={[deviceCoords.lat, deviceCoords.lng]}
                          icon={deviceIcon}
                        >
                          <Popup>
                            {deviceCoords.label || "IoT device location"}
                          </Popup>
                        </Marker>
                      )}
                    </MapContainer>
                  )}

                  <div className="absolute top-6 left-6 z-10 bg-white shadow-xl px-5 py-3 rounded-xl border" style={{ zIndex: 1000 }}>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-3xl font-bold text-red-600">
                      {temperatureValue !== null && temperatureValue !== undefined
                        ? `${temperatureValue}${temperatureUnit}`
                        : "--"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTempBand(shipment?.minTemp, shipment?.maxTemp)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {telemetryTimestamp
                        ? `Updated ${new Date(telemetryTimestamp).toLocaleString()}`
                        : "No telemetry timestamp"}
                    </p>
                  </div>
                  <div className="absolute top-6 right-6 z-10 bg-white shadow-xl px-5 py-3 rounded-xl border" style={{ zIndex: 1000 }}>
                    <p className="text-sm text-gray-600">Shock</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {latestTelemetry?.shock
                        ? "Detected"
                        : shipment?.shock?.level || "--"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {latestTelemetry?.shock
                        ? `Value: ${latestTelemetry?.shockValue ?? "n/a"}`
                        : shipment?.shock?.note || "No data"}
                    </p>
                  </div>
                  <div className="absolute bottom-6 right-6 z-10 bg-white shadow-xl px-5 py-3 rounded-xl border" style={{ zIndex: 1000 }}>
                    <p className="text-sm text-gray-600">Parcel Value</p>
                    <p className="text-xl font-bold text-blue-600">
                      {parcelValue !== null && parcelValue !== undefined
                        ? `${parcelValue}`
                        : "--"}
                    </p>
                  </div>
                  <div className="absolute bottom-6 left-6 z-10 bg-white shadow-xl px-5 py-3 rounded-xl border" style={{ zIndex: 1000 }}>
                    <p className="text-sm text-gray-600">ETA</p>
                    <p className="text-xl font-bold text-slate-900">
                      {etaInfo ? formatDuration(etaInfo.duration) : "--"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {etaInfo ? formatDistance(etaInfo.distance) : "Distance unavailable"}
                    </p>
                    {etaError ? (
                      <p className="text-xs text-red-500 mt-1">{etaError}</p>
                    ) : null}
                  </div>
                </div>
              )}

              {isTelemetryLoading && (
                <p className="text-xs text-gray-500 mt-3">
                  Refreshing telemetry...
                </p>
              )}
              {telemetryError && (
                <p className="text-xs text-red-600 mt-3">{telemetryError}</p>
              )}
            </div>

            <div className="customer-card bg-white p-6 shadow rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-primary">IoT Alerts</h2>
                  <p className="text-sm text-gray-600">
                    Temperature, shock, and humidity breach notifications.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700">
                  {alerts.length} alert{alerts.length === 1 ? "" : "s"}
                </span>
              </div>

              {alertsError ? (
                <p className="text-xs text-red-600 mb-2">{alertsError}</p>
              ) : null}
              {isAlertsLoading ? (
                <p className="text-xs text-gray-500 mb-2">Refreshing alerts...</p>
              ) : null}

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

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
}
