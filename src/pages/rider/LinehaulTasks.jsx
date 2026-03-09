import { useState } from "react";
import RiderTopbar from "./components/RiderTopbar";

const demoTrips = [
  {
    id: "LH-9001",
    fromHub: "Lahore Hub A",
    toHub: "Karachi Hub B",
    loadCount: 86,
    eta: "6h 40m",
    manifestUrl: "#",
    shipments: ["SS-22003", "SS-22010", "SS-22018"],
  },
  {
    id: "LH-9002",
    fromHub: "Islamabad Hub C",
    toHub: "Lahore Hub A",
    loadCount: 24,
    eta: "4h 05m",
    manifestUrl: "#",
    shipments: ["SS-22021", "SS-22022"],
  },
];

export default function LinehaulTasks() {
  const [trips, setTrips] = useState(demoTrips);
  const [statusMap, setStatusMap] = useState({});

  const updateStatus = (id, status) =>
    setStatusMap((prev) => ({ ...prev, [id]: status }));

  const completeTrip = (id) => {
    updateStatus(id, "Reached Destination Hub");
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-light customer-page">
      <RiderTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Linehaul / Hub Transfer
            </h1>
            <p className="text-gray-600">
              Intercity loads only. Pickup and delivery riders do not see these
              legs.
            </p>
          </div>
          <span className="customer-card bg-white px-3 py-1 rounded-full text-sm text-slate-600">
            Active Trips: {trips.length}
          </span>
        </div>

        <div className="space-y-4">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              status={statusMap[trip.id] || "Assigned"}
              onStart={() => updateStatus(trip.id, "On Route")}
              onReach={() => completeTrip(trip.id)}
            />
          ))}
          {trips.length === 0 && (
            <div className="customer-card bg-white rounded-xl p-6 text-center text-gray-500">
              No intercity loads right now. Await next linehaul assignment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip, status, onStart, onReach }) {
  return (
    <div className="customer-card customer-card-elevate bg-white rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Trip</p>
          <h3 className="text-lg font-bold text-primary">{trip.id}</h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700">
          {status}
        </span>
      </div>

      <div className="text-sm text-gray-700 grid sm:grid-cols-2 gap-2">
        <p>
          <strong>From:</strong> {trip.fromHub}
        </p>
        <p>
          <strong>To:</strong> {trip.toHub}
        </p>
        <p>
          <strong>ETA:</strong> {trip.eta}
        </p>
        <p>
          <strong>Parcels:</strong> {trip.loadCount}
        </p>
      </div>

      <div className="bg-gray-50 border rounded-lg p-3 text-sm">
        <p className="font-semibold mb-1">Load Sheet</p>
        <div className="flex flex-wrap gap-2">
          {trip.shipments.map((s) => (
            <span
              key={s}
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        <button
          onClick={onStart}
          className="customer-button bg-primary text-white rounded-lg px-3 py-2 hover:bg-blue-700"
        >
          Start Linehaul Trip
        </button>
        <button
          onClick={onReach}
          className="customer-button bg-green-600 text-white rounded-lg px-3 py-2 hover:bg-green-700"
        >
          Reached Destination Hub
        </button>
      </div>
    </div>
  );
}
