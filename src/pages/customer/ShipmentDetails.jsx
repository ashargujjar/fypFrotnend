import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./components/Topbar";
import { shipments } from "./data/shipments";

const STATUS_COLOR = {
  Delivered: "text-green-700",
  "In Transit": "text-yellow-700",
  Alert: "text-red-700",
};

const STATUS_PROGRESS = {
  Delivered: 100,
  "In Transit": 70,
  Alert: 45,
};

const MAP_BACKGROUND_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(15,23,42,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.15) 1px, transparent 1px), radial-gradient(circle at top, #0f172a, #1e293b)",
  backgroundSize: "50px 50px, 50px 50px, 100% 100%",
  backgroundPosition: "center",
};

const formatTemperatureUnit = (unit) =>
  unit === "C" ? "\u00b0C" : unit || "\u00b0C";

const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_CSS_ID = "leaflet-css";
const LEAFLET_SCRIPT_ID = "leaflet-js";
const DEFAULT_CENTER = { lat: 33.6844, lng: 73.0479 };

let leafletPromise;

const ensureLeafletCss = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById(LEAFLET_CSS_ID)) return;
  const link = document.createElement("link");
  link.id = LEAFLET_CSS_ID;
  link.rel = "stylesheet";
  link.href = LEAFLET_CSS_URL;
  document.head.appendChild(link);
};

const loadLeaflet = () => {
  if (typeof window === "undefined") return Promise.resolve(null);
  ensureLeafletCss();
  if (window.L) return Promise.resolve(window.L);
  if (!leafletPromise) {
    leafletPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(LEAFLET_SCRIPT_ID);
      const handleLoad = () => {
        if (window.L) resolve(window.L);
        else reject(new Error("Leaflet failed to load."));
      };
      const handleError = () =>
        reject(new Error("Failed to load Leaflet mapping library."));

      if (existingScript) {
        existingScript.addEventListener("load", handleLoad, { once: true });
        existingScript.addEventListener("error", handleError, { once: true });
      } else {
        const script = document.createElement("script");
        script.id = LEAFLET_SCRIPT_ID;
        script.src = LEAFLET_JS_URL;
        script.async = true;
        script.onload = handleLoad;
        script.onerror = handleError;
        document.body.appendChild(script);
      }
    });
  }
  return leafletPromise;
};

export default function ShipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shipment = shipments.find((s) => s.id === id);
  const routeProgress = shipment ? (STATUS_PROGRESS[shipment.status] ?? 60) : 0;
  const routeStops = shipment?.route ?? [];
  const humidityValue = shipment?.humidity ?? 42;
  const temperatureUnit = shipment
    ? formatTemperatureUnit(shipment.temperature.unit)
    : "\u00b0C";
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapMarkerRef = useRef(null);
  const mapAnimationRef = useRef(null);
  const [mapError, setMapError] = useState("");

  const handleSelectShipment = (event) => {
    const nextId = event.target.value;
    if (nextId) {
      navigate(`/customer/shipments/${nextId}`);
    }
  };

  const statusColor = shipment
    ? STATUS_COLOR[shipment.status] || "text-gray-700"
    : "text-gray-700";

  useEffect(() => {
    setMapError("");
    if (!shipment || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      try {
        const L = await loadLeaflet();
        if (!isMounted || !L || !mapContainerRef.current) return;

        if (mapAnimationRef.current) {
          clearInterval(mapAnimationRef.current);
          mapAnimationRef.current = null;
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const routePoints = shipment.coordinates?.path ?? [];
        const fallback =
          routePoints[0] || shipment.coordinates?.center || DEFAULT_CENTER;
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: false,
        }).setView(
          [fallback.lat, fallback.lng],
          shipment.coordinates?.zoom ?? 11
        );
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        const latLngs = routePoints.map((pt) => [pt.lat, pt.lng]);
        if (latLngs.length > 1) {
          const routeLine = L.polyline(latLngs, {
            color: "#38bdf8",
            weight: 4,
            opacity: 0.9,
          }).addTo(map);
          map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });
        }

        if (latLngs.length) {
          const markerIcon = L.divIcon({
            className: "",
            html: `<div style="width:20px;height:20px;border-radius:9999px;background:#facc15;border:3px solid #0f172a;box-shadow:0 0 18px rgba(250,204,21,0.75);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });
          const marker = L.marker(latLngs[0], { icon: markerIcon }).addTo(map);
          mapMarkerRef.current = marker;

          if (latLngs.length > 1) {
            let step = 0;
            mapAnimationRef.current = window.setInterval(() => {
              step = (step + 1) % latLngs.length;
              if (mapMarkerRef.current) {
                mapMarkerRef.current.setLatLng(latLngs[step]);
              }
            }, 3500);
          }
        }
      } catch (error) {
        if (isMounted) {
          setMapError(
            "Unable to load the live map right now. Please try again shortly."
          );
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapAnimationRef.current) {
        clearInterval(mapAnimationRef.current);
        mapAnimationRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      mapMarkerRef.current = null;
    };
  }, [shipment?.id]);

  return (
    <div className="min-h-screen bg-light">
      <Topbar />

      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        {/* TOP BAR: SHIPMENT SELECTOR */}
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-500">
            Select a shipment to view its live telemetry, route, IoT data, and
            alerts.
          </p>

            <select
              value={shipment?.id ?? ""}
              onChange={handleSelectShipment}
              className="px-4 py-3 rounded-lg bg-white border outline-none focus:border-primary"
            >
              <option value="" disabled>
                Select shipment
              </option>
              {shipments.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} ({s.status})
                </option>
              ))}
            </select>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-primary mb-6">
          Shipment Details {shipment ? `- ${shipment.id}` : ""}
        </h1>

          {!shipment ? (
            <div className="bg-white p-6 rounded-xl shadow text-gray-600">
              Pick a shipment from the dropdown above to load route,
              temperature, shock & alert data.
            </div>
          ) : (
            <>
              {/* ============================= */}
              {/* FULL WIDTH MAP SECTION        */}
              {/* ============================= */}
              {/* FULL-WIDTH MAP + SENSOR SUMMARY */}
              <div className="bg-white p-6 shadow rounded-2xl mb-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold text-primary">
                    Live Location & Sensor Data
                  </h2>
                  <span className="text-sm font-semibold text-gray-500">
                    Updated {shipment.updatedAt ?? "2 mins ago"}
                  </span>
                </div>

                <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                  <div
                    className="relative min-h-[320px] md:min-h-[420px] rounded-2xl border border-slate-100 overflow-hidden bg-slate-900"
                    style={MAP_BACKGROUND_STYLE}
                  >
                    <div
                      key={shipment.id}
                      ref={mapContainerRef}
                      className="absolute inset-0 h-full w-full"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/5 via-transparent to-slate-900/40" />

                    <div className="pointer-events-none absolute top-4 left-4 right-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-white/80">
                      <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                        Origin: {shipment.origin}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                        Destination: {shipment.destination}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                        Rider: {shipment.rider}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                        Status: {shipment.status}
                      </span>
                    </div>

                    <div className="pointer-events-none absolute bottom-4 left-4 right-4">
                      <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300"
                          style={{ width: `${routeProgress}%` }}
                        />
                      </div>
                      {routeStops.length > 0 && (
                        <div className="grid grid-cols-1 gap-3 mt-4 text-center text-[0.6rem] font-semibold uppercase tracking-wide text-white/80 sm:grid-cols-3 lg:grid-cols-5">
                          {routeStops.map((stop) => (
                            <div
                              key={stop}
                              className="flex flex-col items-center gap-1"
                            >
                              <div className="h-2 w-2 rounded-full bg-white" />
                              <p>{stop}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {mapError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 text-center text-sm font-medium text-white px-6">
                        {mapError}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Temperature
                      </p>
                      <p className="text-4xl font-bold text-slate-900 leading-tight">
                        {shipment.temperature.current}
                        <span className="text-lg align-super ml-1 text-slate-500">
                          {temperatureUnit}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Target band 8{"\u00b0"}C - 15{"\u00b0"}C
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Shock Level
                      </p>
                      <p className="text-3xl font-bold text-amber-500">
                        {shipment.shock.level}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        {shipment.shock.note}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Humidity / Alerts
                      </p>
                      <p className="text-3xl font-bold text-slate-900">
                        {humidityValue}
                        <span className="text-lg font-semibold ml-1">% RH</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        {shipment.alerts.length} active alerts
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================= */}
              {/* SHIPMENT INFORMATION          */}
              {/* ============================= */}
              <div className="bg-white p-6 shadow rounded-xl mb-10">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Shipment Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <p>
                    <strong>Sender:</strong> {shipment.sender}
                  </p>
                  <p>
                    <strong>Receiver:</strong> {shipment.receiver}
                  </p>
                  <p>
                    <strong>Origin:</strong> {shipment.origin}
                  </p>
                  <p>
                    <strong>Destination:</strong> {shipment.destination}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`font-semibold ${statusColor}`}>
                      {shipment.status}
                    </span>
                  </p>

                  <p>
                    <strong>ETA:</strong> {shipment.eta}
                  </p>
                  <p>
                    <strong>Rider:</strong> {shipment.rider}
                  </p>
                  <p>
                    <strong>Shipment Type:</strong> {shipment.type}
                  </p>
                </div>
              </div>

              {/* ============================= */}
              {/* TIMELINE                      */}
              {/* ============================= */}
              <div className="bg-white p-6 shadow rounded-xl mb-10">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Shipment Timeline
                </h2>

                <ul className="space-y-4">
                  {shipment.timeline.map((event) => (
                    <li
                      key={`${shipment.id}-${event.timestamp}`}
                      className="border-l-4 border-primary pl-4"
                    >
                      <p className="font-semibold">{event.label}</p>
                      <p className="text-gray-500 text-sm">{event.timestamp}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ============================= */}
              {/* BLOCKCHAIN                    */}
              {/* ============================= */}
              <div className="bg-white p-6 shadow rounded-xl mb-10">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Blockchain Verification
                </h2>

                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-gray-50 text-gray-600">
                      <th className="p-3">Event</th>
                      <th className="p-3">Hash</th>
                      <th className="p-3">Block</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Picked Up</td>
                      <td className="p-3 text-primary">0xA3F...21C</td>
                      <td className="p-3">123442</td>
                    </tr>

                    <tr className="border-b">
                      <td className="p-3">Warehouse Out</td>
                      <td className="p-3 text-primary">0xBB1...94E</td>
                      <td className="p-3">123498</td>
                    </tr>

                    <tr>
                      <td className="p-3">In Transit</td>
                      <td className="p-3 text-primary">0x8CD...77A</td>
                      <td className="p-3">123512</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ============================= */}
              {/* ALERTS                        */}
              {/* ============================= */}
              <div className="bg-white p-6 shadow rounded-xl mb-10">
                <h2 className="text-xl font-bold text-red-500 mb-4">
                  Active Alerts
                </h2>

                <ul className="space-y-3">
                  {shipment.alerts.map((alert) => (
                    <li
                      key={`${shipment.id}-${alert}`}
                      className="bg-red-100 text-red-700 p-3 rounded-lg font-semibold"
                    >
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>

            </>
        )}
      </div>
    </div>
  );
}
