import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import RiderTopbar from "./components/RiderTopbar";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const isCurrentLocation = (value) =>
  /current location|your current location/i.test(String(value || ""));

const geocode = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    query,
  )}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Unable to reach geocoding service.");
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`No location found for "${query}".`);
  }
  const hit = data[0];
  return {
    lat: Number(hit.lat),
    lng: Number(hit.lon),
    label: hit.display_name,
  };
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

export default function RiderRouteMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const title = state.title || "Route Preview";
  const from = state.from || "Your current location";
  const to = state.to || "Destination not provided";
  const note = state.note || "";
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeMeta, setRouteMeta] = useState(null);
  const [routeError, setRouteError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const mapCenter = useMemo(() => {
    if (origin) return origin;
    if (destination) return destination;
    return { lat: 24.8607, lng: 67.0011 };
  }, [origin, destination]);

  useEffect(() => {
    let isMounted = true;
    const resolveOrigin = async () => {
      if (!from || isCurrentLocation(from)) {
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported on this device.");
        }
        return await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                label: "Your current location",
              }),
            () => reject(new Error("Unable to access current location.")),
            { enableHighAccuracy: true, timeout: 10000 },
          );
        });
      }
      return await geocode(from);
    };

    const resolveDestination = async () => {
      if (!to || to === "Destination not provided") {
        throw new Error("Destination address is missing.");
      }
      return await geocode(to);
    };

    (async () => {
      try {
        setIsLoading(true);
        setRouteError("");
        setRouteMeta(null);
        const [originResolved, destinationResolved] = await Promise.all([
          resolveOrigin(),
          resolveDestination(),
        ]);
        if (!isMounted) return;
        setOrigin(originResolved);
        setDestination(destinationResolved);
      } catch (error) {
        if (!isMounted) return;
        setOrigin(null);
        setDestination(null);
        setRouteError(error?.message || "Unable to load route.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [from, to]);

  return (
    <div className="min-h-screen bg-light customer-page">
      <RiderTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
            {note && <p className="text-gray-600">{note}</p>}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="customer-button bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm hover:border-primary/40"
          >
            Back to tasks
          </button>
        </div>

        <div className="customer-card bg-white rounded-xl shadow p-6 space-y-2">
          <p className="text-xs text-gray-500">Route Details</p>
          <p className="text-sm text-gray-700">
            <strong>From:</strong> {from}
          </p>
          <p className="text-sm text-gray-700">
            <strong>To:</strong> {to}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Estimated distance:</strong>{" "}
            {routeMeta ? formatDistance(routeMeta.distance) : "--"}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Estimated time:</strong>{" "}
            {routeMeta ? formatDuration(routeMeta.duration) : "--"}
          </p>
        </div>

        <div className="customer-card bg-white rounded-xl shadow p-6">
          {routeError && (
            <div className="w-full h-80 bg-red-50 rounded-xl flex items-center justify-center text-red-600 text-sm px-6 text-center">
              {routeError}
            </div>
          )}
          {!routeError && isLoading && (
            <div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm">
              Loading route...
            </div>
          )}
          {!routeError && !isLoading && origin && destination && (
            <div className="w-full h-80 rounded-xl overflow-hidden">
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[origin.lat, origin.lng]}>
                  <Popup>{origin.label || "Start"}</Popup>
                </Marker>
                <Marker position={[destination.lat, destination.lng]}>
                  <Popup>{destination.label || "Destination"}</Popup>
                </Marker>
                <RoutingMachine
                  from={origin}
                  to={destination}
                  onRouteFound={(summary) =>
                    setRouteMeta({
                      distance: summary.totalDistance,
                      duration: summary.totalTime,
                    })
                  }
                  onRouteError={() =>
                    setRouteError("Unable to calculate route.")
                  }
                />
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RoutingMachine({ from, to, onRouteFound, onRouteError }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !from || !to) return undefined;
    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      show: false,
      lineOptions: {
        styles: [{ color: "#2563eb", weight: 5, opacity: 0.85 }],
      },
      createMarker: () => null,
    });

    control.on("routesfound", (event) => {
      const route = event?.routes?.[0];
      if (route?.summary && onRouteFound) {
        onRouteFound(route.summary);
      }
    });
    control.on("routingerror", () => {
      if (onRouteError) onRouteError();
    });

    control.addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, from, to, onRouteFound, onRouteError]);

  return null;
}
