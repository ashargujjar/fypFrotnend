import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RiderTopbar from "./components/RiderTopbar";

const demoPickups = [
  {
    id: "PK-1201",
    shipmentId: "SS-22001",
    pickupAddress: "Johar Town, Lahore",
    contact: "+92 300 1234567",
    notes: "Keep upright; fragile glassware",
    origin_city: "Lahore",
    destination_city: "Lahore",
    iotRequired: ["GPS", "Shock"],
  },
  {
    id: "PK-1202",
    shipmentId: "SS-22002",
    pickupAddress: "Gulberg II, Lahore",
    contact: "+92 302 9876543",
    notes: "Collect COD Rs 1500 at pickup",
    origin_city: "Lahore",
    destination_city: "Lahore",
    iotRequired: ["Temperature"],
  },
  {
    id: "PK-1203",
    shipmentId: "SS-22003",
    pickupAddress: "Civil Lines, Faisalabad",
    contact: "+92 300 5552211",
    notes: "Temperature-controlled box",
    origin_city: "Faisalabad",
    destination_city: "Karachi",
    iotRequired: ["GPS", "Temperature"],
  },
];

export default function PickupTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(
    demoPickups.filter(
      (t) => t.origin_city === t.destination_city
    )
  );
  const [statusMap, setStatusMap] = useState({});
  const [iotMap, setIotMap] = useState({});

  const setStatus = (id, status) =>
    setStatusMap((prev) => ({ ...prev, [id]: status }));

  const advance = (id, status) => {
    setStatus(id, status);
    if (status === "Dropped at Origin Hub") {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const updateIot = (id, updates) =>
    setIotMap((prev) => ({
      ...prev,
      [id]: {
        deviceType: "",
        deviceId: "",
        status: "Not attached",
        ...prev[id],
        ...updates,
      },
    }));

  const handleRoute = (task) => {
    navigate("/rider/route", {
      state: {
        title: `Route to pickup for ${task.shipmentId}`,
        from: "Your current location",
        to: task.pickupAddress,
        note: `Pickup task ${task.id}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-light customer-page">
      <RiderTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">Pickup Tasks</h1>
            <p className="text-gray-600">
              Same-city pickups only; intercity legs move to Linehaul riders.
            </p>
          </div>
          <span className="customer-card bg-white px-3 py-1 rounded-full text-sm text-slate-600">
            Pending: {tasks.length}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              status={statusMap[task.id] || "Assigned"}
              iotState={iotMap[task.id]}
              onAdvance={advance}
              onIotChange={updateIot}
              onRoute={handleRoute}
            />
          ))}
          {tasks.length === 0 && (
            <div className="customer-card bg-white rounded-xl p-6 text-center text-gray-500 col-span-full">
              No pickup tasks. Awaiting dispatch from admin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, status, iotState, onAdvance, onIotChange, onRoute }) {
  const iot = iotState || {
    deviceId: "",
  };
  const requiresIot = (task.iotRequired || []).length > 0;
  const showIot = requiresIot && status === "Arrived at Pickup";

  return (
    <div className="customer-card customer-card-elevate bg-white rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Shipment {task.shipmentId}</p>
          <h3 className="text-lg font-bold text-primary">{task.id}</h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-700">
          {status}
        </span>
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <strong>Pickup:</strong> {task.pickupAddress}
        </p>
        <p>
          <strong>Contact:</strong> {task.contact}
        </p>
        <p className="text-gray-500">{task.notes}</p>
        {requiresIot && (
          <p className="text-xs text-amber-700 font-semibold">
            IoT required for this pickup.
          </p>
        )}
      </div>

      {showIot && (
        <div className="border rounded-lg p-3 bg-slate-50 space-y-2">
          <p className="text-sm font-semibold text-primary">
            Attach IoT Device
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <input
              type="text"
              value={iot.deviceId}
              onChange={(e) =>
                onIotChange(task.id, { deviceId: e.target.value })
              }
              placeholder="Enter device ID"
              className="customer-input border rounded-lg px-3 py-2 col-span-2"
            />
            <button
              onClick={() =>
                onIotChange(task.id, {
                  status: "Device attached",
                })
              }
              className="customer-button bg-primary text-white rounded-lg px-3 py-2 col-span-2 hover:bg-blue-700"
            >
              Attach IoT Device
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-sm">
        <button
          onClick={() => onAdvance(task.id, "On the Way")}
          className="customer-button bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-blue-100"
        >
          Start Pickup
        </button>
        <button
          onClick={() => onAdvance(task.id, "Arrived at Pickup")}
          className="customer-button bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-blue-100"
        >
          Arrive
        </button>
        <button
          onClick={() => onAdvance(task.id, "Pickup Completed")}
          className="customer-button bg-green-600 text-white rounded-lg px-3 py-2 col-span-2 hover:bg-green-700"
        >
          Confirm Pickup
        </button>
        <button
          onClick={() => onAdvance(task.id, "Dropped at Origin Hub")}
          className="customer-button bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg px-3 py-2 col-span-2 hover:bg-emerald-100"
        >
          Mark Dropped at Warehouse
        </button>
        <button
          onClick={() => onRoute(task)}
          className="customer-button bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 col-span-2 hover:bg-blue-100"
        >
          View Route to Pickup
        </button>
      </div>
    </div>
  );
}
