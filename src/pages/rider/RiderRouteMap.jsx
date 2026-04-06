import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

const MAPBOX_TOKEN = import.meta.env.VITE_MAP_BOX_TOKEN;

const riderIcon = L.divIcon({
  className: "route-marker",
  html: `<div style="background:#2563eb;color:#fff;width:28px;height:28px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #fff;box-shadow:0 8px 16px rgba(15,23,42,0.25);">R</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -24],
});

const destinationIcon = L.divIcon({
  className: "route-marker",
  html: `<div style="background:#ef4444;color:#fff;width:28px;height:28px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #fff;box-shadow:0 8px 16px rgba(15,23,42,0.25);">D</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -24],
});

const geocode = async (query) => {
  if (!MAPBOX_TOKEN) {
    throw new Error("Missing Mapbox token.");
  }
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query,
  )}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=PK`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Unable to reach geocoding service.");
  }
  const data = await res.json();
  if (!Array.isArray(data?.features) || data.features.length === 0) {
    throw new Error(`No location found for "${query}".`);
  }
  const hit = data.features[0];
  const [lng, lat] = hit.center || [];
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error(`No location found for "${query}".`);
  }
  return {
    lat,
    lng,
    label: hit.place_name,
  };
};

const fetchRoute = async (start, end) => {
  if (!MAPBOX_TOKEN) {
    throw new Error("Missing Mapbox token.");
  }
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Unable to fetch route.");
  }
  const data = await res.json();
  const route = data?.routes?.[0];
  if (!route?.geometry?.coordinates?.length) {
    throw new Error("No route found.");
  }
  const line = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  return {
    line,
    distance: route.distance,
    duration: route.duration,
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

const getDistanceMeters = (pointA, pointB) => {
  if (!pointA || !pointB) return Infinity;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const lat1 = toRad(pointA.lat);
  const lat2 = toRad(pointB.lat);
  const deltaLat = toRad(pointB.lat - pointA.lat);
  const deltaLng = toRad(pointB.lng - pointA.lng);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371000 * c;
};

export default function RiderRouteMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const title = state.title || "Route Preview";
  const from = state.from || "Your current location";
  const to = state.to || "Destination not provided";
  const routeType = state.routeType || "";
  const pickupAddressFull = state.pickupAddressFull || "";
  const deliveryAddressFull = state.deliveryAddressFull || "";
  const note = state.note || "";
  const toCoords = state.toCoords;
  const toLabel = state.toLabel || to;
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [originReady, setOriginReady] = useState(false);
  const [destinationReady, setDestinationReady] = useState(false);
  const [routeLine, setRouteLine] = useState([]);
  const [routeMeta, setRouteMeta] = useState(null);
  const [routeError, setRouteError] = useState("");
  const [routeOrigin, setRouteOrigin] = useState(null);
  const lastRouteUpdateRef = useRef(0);
  const lastRouteOriginRef = useRef(null);
  const isLoading = !routeError && (!originReady || !destinationReady);

  const mapCenter = useMemo(() => {
    if (origin) return origin;
    if (destination) return destination;
    return { lat: 24.8607, lng: 67.0011 };
  }, [origin, destination]);

  const destinationText = useMemo(() => {
    if (routeType === "pickup" && pickupAddressFull) return pickupAddressFull;
    if (routeType === "delivery" && deliveryAddressFull)
      return deliveryAddressFull;
    if (to && to !== "Destination not provided") return to;
    return toLabel || "";
  }, [routeType, pickupAddressFull, deliveryAddressFull, to, toLabel]);
  const originText = useMemo(() => {
    if (!from || isCurrentLocation(from)) return "";
    return from;
  }, [from]);
  const canOpenGoogleMaps = Boolean(destinationText);

  const openInGoogleMaps = () => {
    if (!destinationText) return;
    const params = new URLSearchParams({
      api: "1",
      travelmode: "driving",
      destination: destinationText,
    });
    if (originText) {
      params.set("origin", originText);
    }
    const url = `https://www.google.com/maps/dir/?${params.toString()}`;
    window.open(url, "_blank", "noopener");
  };

  useEffect(() => {
    let isMounted = true;
    let watchId = null;
    const liveOrigin = !from || isCurrentLocation(from);

    const updateOrigin = (nextOrigin) => {
      if (!isMounted) return;
      setOrigin(nextOrigin);
      setOriginReady(true);
    };

    const maybeUpdateRouteOrigin = (nextOrigin, force = false) => {
      const now = Date.now();
      const lastOrigin = lastRouteOriginRef.current;
      const timeElapsed = now - lastRouteUpdateRef.current;
      const distance = getDistanceMeters(lastOrigin, nextOrigin);
      const shouldUpdate = force || timeElapsed >= 30000 || distance >= 150;
      if (!shouldUpdate) return;
      lastRouteUpdateRef.current = now;
      lastRouteOriginRef.current = nextOrigin;
      setRouteOrigin(nextOrigin);
    };

    const resolveOriginOnce = async () => {
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
    };

    const startOriginWatch = () => {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported on this device.");
      }
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const nextOrigin = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: "Your current location",
          };
          updateOrigin(nextOrigin);
          maybeUpdateRouteOrigin(nextOrigin, false);
        },
        () => {
          setRouteError("Unable to access current location.");
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 },
      );
    };

    const resolveDestination = async () => {
      const destinationValue = destinationText || to;
      if (
        toCoords &&
        Number.isFinite(Number(toCoords.lat)) &&
        Number.isFinite(Number(toCoords.lng))
      ) {
        return {
          lat: Number(toCoords.lat),
          lng: Number(toCoords.lng),
          label: destinationValue || toLabel || "Destination",
        };
      }
      if (!destinationValue || destinationValue === "Destination not provided") {
        throw new Error("Destination address is missing.");
      }
      return await geocode(destinationValue);
    };

    (async () => {
      try {
        setRouteError("");
        setRouteMeta(null);
        setRouteLine([]);
        setOriginReady(false);
        setDestinationReady(false);
        setOrigin(null);
        setRouteOrigin(null);
        lastRouteUpdateRef.current = 0;
        lastRouteOriginRef.current = null;

        const destinationResolved = await resolveDestination();
        if (!isMounted) return;
        setDestination(destinationResolved);
        setDestinationReady(true);

        if (liveOrigin) {
          const firstOrigin = await resolveOriginOnce();
          updateOrigin(firstOrigin);
          maybeUpdateRouteOrigin(firstOrigin, true);
          startOriginWatch();
        } else {
          const originResolved = await geocode(from);
          updateOrigin(originResolved);
          maybeUpdateRouteOrigin(originResolved, true);
        }
      } catch (error) {
        if (!isMounted) return;
        setOrigin(null);
        setDestination(null);
        setRouteOrigin(null);
        setRouteLine([]);
        setRouteError(error?.message || "Unable to load route.");
      }
    })();

    return () => {
      isMounted = false;
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [from, to]);

  useEffect(() => {
    let isMounted = true;
    const start = routeOrigin || origin;
    if (!start || !destination) return undefined;

    (async () => {
      try {
        setRouteError("");
        const route = await fetchRoute(start, destination);
        if (!isMounted) return;
        setRouteLine(route.line);
        setRouteMeta({ distance: route.distance, duration: route.duration });
      } catch (error) {
        if (!isMounted) return;
        setRouteLine([]);
        setRouteError(error?.message || "Unable to calculate route.");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [routeOrigin, origin, destination]);

  const boundsPoints = useMemo(() => {
    if (routeLine.length > 0) return routeLine;
    if (origin && destination)
      return [
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ];
    return [];
  }, [routeLine, origin, destination]);

  return (
    <div className="min-h-screen bg-light customer-page">
      <RiderTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
            {note && <p className="text-gray-600">{note}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={openInGoogleMaps}
              disabled={!canOpenGoogleMaps}
              className={`customer-button px-3 py-2 rounded-lg text-sm ${
                canOpenGoogleMaps
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              Open in Google Maps
            </button>
            <button
              onClick={() => navigate(-1)}
              className="customer-button bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm hover:border-primary/40"
            >
              Back to tasks
            </button>
          </div>
        </div>

        <div className="customer-card bg-white rounded-xl shadow p-6 space-y-2">
          <p className="text-xs text-gray-500">Route Details</p>
          <p className="text-sm text-gray-700">
            <strong>From:</strong> {from}
          </p>
          <p className="text-sm text-gray-700">
            <strong>To:</strong> {destinationText || to}
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
                  attribution="&copy; Mapbox &copy; OpenStreetMap"
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
                  tileSize={512}
                  zoomOffset={-1}
                />
                {boundsPoints.length > 0 && (
                  <FitBounds points={boundsPoints} />
                )}
                {routeLine.length > 0 && (
                  <>
                    <Polyline
                      positions={routeLine}
                      pathOptions={{
                        color: "#93c5fd",
                        weight: 10,
                        opacity: 0.7,
                      }}
                    />
                    <Polyline
                      positions={routeLine}
                      pathOptions={{
                        color: "#2563eb",
                        weight: 6,
                        opacity: 0.95,
                      }}
                    />
                  </>
                )}
                <Marker position={[origin.lat, origin.lng]} icon={riderIcon}>
                  <Popup>{origin.label || "Rider"}</Popup>
                </Marker>
                <Marker
                  position={[destination.lat, destination.lng]}
                  icon={destinationIcon}
                >
                  <Popup>{destination.label || "Destination"}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
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
