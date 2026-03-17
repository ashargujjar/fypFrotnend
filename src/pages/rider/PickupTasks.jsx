import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RiderTopbar from "./components/RiderTopbar";
import { toastError, toastSuccess } from "../../utils/toast";
const API_URL = import.meta.env.VITE_API_URL;

const normalize = (value) => String(value || "").trim();
const normalizeStatus = (value) => normalize(value).toLowerCase();

const getPickupStepIndex = (value) => {
  const status = normalizeStatus(value);
  if (!status) return -1;
  if (
    status.includes("dropped at origin hub") ||
    status.includes("dropped at warehouse") ||
    status.includes("droped at warehouse")
  ) {
    return 3;
  }
  if (status.includes("pickup completed")) return 2;
  if (status.includes("arrived at pickup")) return 1;
  if (status.includes("on the way") || status.includes("pickup in progress")) {
    return 0;
  }
  return -1;
};

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    if (value.$oid) return normalize(value.$oid);
    if (value._id) return normalizeId(value._id);
    if (value.id) return normalizeId(value.id);
  }
  return normalize(value);
};

const resolveShipment = (task) => {
  if (task?.shipment && typeof task.shipment === "object") return task.shipment;
  if (task?.shipmentId && typeof task.shipmentId === "object")
    return task.shipmentId;
  return null;
};

const isSameCity = (origin, destination) => {
  const originCity = normalize(origin).toLowerCase();
  const destinationCity = normalize(destination).toLowerCase();
  if (!originCity || !destinationCity) return true;
  return originCity === destinationCity;
};

const buildPickupTasks = (list) =>
  list
    .map((task, index) => {
      const shipment = resolveShipment(task);
      const shipmentId = normalizeId(
        shipment?._id || shipment?.id || task?.shipmentId,
      );
      const taskId = normalizeId(task?._id || task?.id) || `PK-${index + 1}`;
      const pickupCity = shipment?.pickupCity || shipment?.origin_city || "";
      const deliveryCity =
        shipment?.deliveryCity || shipment?.destination_city || "";
      const notes = normalize(shipment?.notes || shipment?.note);
      const status =
        task?.status || shipment?.riderStatus || shipment?.status || "Assigned";

      return {
        id: taskId,
        shipmentId: shipmentId || "-",
        pickupAddress: shipment?.pickupAddress || "N/A",
        contact:
          shipment?.receiverPhone ||
          shipment?.contact ||
          shipment?.phone ||
          "N/A",
        notes: notes || "No notes provided.",
        origin_city: pickupCity,
        destination_city: deliveryCity,
        iotRequired: Array.isArray(shipment?.iotRequired)
          ? shipment.iotRequired
          : Array.isArray(task?.iotRequired)
            ? task.iotRequired
            : [],
        iotDeviceId: shipment?.iotDeviceId || "",
        iotStatus: shipment?.iotStatus || "none",
        status,
      };
    })
    .filter((task) => isSameCity(task.origin_city, task.destination_city));

export default function PickupTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingMap, setUpdatingMap] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setLoadError("Missing auth token.");
      setTasks([]);
      return;
    }

    let isMounted = true;
    const refreshIntervalMs = 20000;

    const fetchRiderTasks = async (showLoader = false) => {
      try {
        if (showLoader) {
          setIsLoading(true);
          setLoadError("");
        }
        const endpoint = API_URL
          ? `${API_URL}/rider/getRiderTasks`
          : "/rider/getRiderTasks";
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load pickup tasks.");
        }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.tasks)
            ? data.tasks
            : Array.isArray(data?.riderTasks)
              ? data.riderTasks
              : Array.isArray(data?.data)
                ? data.data
                : [];
        if (isMounted) {
          setTasks(buildPickupTasks(list));
          if (showLoader) setLoadError("");
        }
      } catch (error) {
        if (isMounted) {
          if (showLoader) {
            setLoadError(error?.message || "Unable to load pickup tasks.");
            setTasks([]);
          }
        }
      } finally {
        if (isMounted && showLoader) setIsLoading(false);
      }
    };

    fetchRiderTasks(true);

    const interval = setInterval(() => {
      fetchRiderTasks(false);
    }, refreshIntervalMs);

    const handleFocus = () => fetchRiderTasks(false);
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [token]);
  const [statusMap, setStatusMap] = useState({});
  const [iotMap, setIotMap] = useState({});

  const setStatus = (id, status) =>
    setStatusMap((prev) => ({ ...prev, [id]: status }));

  const updateShipmentStatus = async (shipmentId, status) => {
    if (!shipmentId) {
      throw new Error("Missing shipment id.");
    }
    if (!token) {
      throw new Error("Missing auth token.");
    }
    const endpoint = API_URL
      ? `${API_URL}/rider/updateShipmentStatus/${shipmentId}`
      : `/rider/updateShipmentStatus/${shipmentId}`;
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Unable to update shipment status.");
    }
    return data;
  };

  const advance = async (task, status) => {
    const taskId = task?.id;
    const shipmentId = task?.shipmentId;
    if (!taskId) return;
    if (updatingMap[taskId]) return;

    const previousStatus = statusMap[taskId] || task?.status || "Assigned";
    setActionError("");
    setUpdatingMap((prev) => ({ ...prev, [taskId]: status }));
    setStatus(taskId, status);

    try {
      await updateShipmentStatus(shipmentId, status);
      toastSuccess(`Status updated: ${status}`);
      if (status === "Dropped at Origin Hub") {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    } catch (error) {
      setStatus(taskId, previousStatus);
      setActionError(error?.message || "Unable to update shipment status.");
      toastError(error?.message || "Unable to update shipment status.");
    } finally {
      setUpdatingMap((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    }
  };

  const updateIot = (id, updates) =>
    setIotMap((prev) => ({
      ...prev,
      [id]: {
        deviceType: "",
        deviceId: "",
        status: "Not attached",
        isSubmitting: false,
        ...prev[id],
        ...updates,
      },
    }));

  const attachIotDevice = async (shipmentId, deviceId) => {
    if (!shipmentId) {
      throw new Error("Missing shipment id.");
    }
    if (!token) {
      throw new Error("Missing auth token.");
    }
    const endpoint = API_URL
      ? `${API_URL}/rider/iot/attach`
      : "/rider/iot/attach";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shipmentId, deviceId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Unable to attach IoT device.");
    }
    return data;
  };

  const handleAttachIot = async (task) => {
    const taskId = task?.id;
    const shipmentId = task?.shipmentId;
    if (!taskId || !shipmentId || shipmentId === "-") {
      toastError("Missing shipment id.");
      return;
    }
    const current = iotMap[taskId];
    const rawId = current?.deviceId || task?.iotDeviceId || "";
    const deviceId = String(rawId).trim().toUpperCase();
    if (!deviceId) {
      toastError("Enter device ID to attach.");
      return;
    }
    if (current?.isSubmitting) return;
    updateIot(taskId, { status: "Attaching...", isSubmitting: true, deviceId });

    try {
      await attachIotDevice(shipmentId, deviceId);
      updateIot(taskId, {
        status: "Device attached",
        isSubmitting: false,
        deviceId,
      });
      toastSuccess("IoT device attached.");
    } catch (error) {
      updateIot(taskId, { status: "Attach failed", isSubmitting: false });
      toastError(error?.message || "Unable to attach IoT device.");
    }
  };

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
              status={statusMap[task.id] || task.status || "Assigned"}
              iotState={iotMap[task.id]}
              onAdvance={advance}
              onIotChange={updateIot}
              onAttachIot={handleAttachIot}
              onRoute={handleRoute}
              updatingStatus={updatingMap[task.id]}
            />
          ))}
          {actionError && !isLoading && (
            <div className="customer-card bg-white rounded-xl p-4 text-center text-red-600 col-span-full">
              {actionError}
            </div>
          )}
          {isLoading && (
            <div className="customer-card bg-white rounded-xl p-6 text-center text-gray-500 col-span-full">
              Loading pickup tasks...
            </div>
          )}
          {!isLoading && loadError && (
            <div className="customer-card bg-white rounded-xl p-6 text-center text-red-600 col-span-full">
              {loadError}
            </div>
          )}
          {!isLoading && !loadError && tasks.length === 0 && (
            <div className="customer-card bg-white rounded-xl p-6 text-center text-gray-500 col-span-full">
              No pickup tasks. Awaiting dispatch from admin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  status,
  iotState,
  onAdvance,
  onIotChange,
  onAttachIot,
  onRoute,
  updatingStatus,
}) {
  const iot = iotState || {
    deviceId: task?.iotDeviceId || "",
    status: task?.iotStatus === "attached" ? "Device attached" : "Not attached",
    isSubmitting: false,
  };
  const requiresIot = (task.iotRequired || []).length > 0;
  const showIot = normalizeStatus(status).includes("arrived at pickup");
  const isAttached =
    iot.status === "Device attached" || task?.iotStatus === "attached";
  const showAttach = showIot && !isAttached;
  const showAttachedStatus = showIot && isAttached;
  const isUpdating = Boolean(updatingStatus);
  const isActive = (nextStatus) => updatingStatus === nextStatus;
  const currentStep = getPickupStepIndex(status);
  const isDone = (stepIndex) => currentStep >= stepIndex;
  const isUnlocked = (stepIndex) => currentStep >= stepIndex - 1;

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

      {showAttach && (
        <div className="border rounded-lg p-3 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">
              Attach IoT Device
            </p>
            <span className="text-xs text-gray-500">{iot.status}</span>
          </div>
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
              onClick={() => onAttachIot(task)}
              disabled={iot.isSubmitting || isAttached}
              className="customer-button bg-primary text-white rounded-lg px-3 py-2 col-span-2 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {iot.isSubmitting
                ? "Attaching..."
                : isAttached
                ? "Device attached"
                : "Attach IoT Device"}
            </button>
          </div>
        </div>
      )}
      {showAttachedStatus && (
        <div className="border rounded-lg p-3 bg-emerald-50 text-emerald-700 text-sm">
          IoT device attached{(iot.deviceId || task?.iotDeviceId) && ":"}{" "}
          {iot.deviceId || task?.iotDeviceId}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-sm">
        {!isDone(0) && (
          <button
            onClick={() => onAdvance(task, "On the Way")}
            disabled={isUpdating || !isUnlocked(0)}
            className="customer-button bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isActive("On the Way") ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-xs" />
                Updating...
              </span>
            ) : (
              "Start Pickup"
            )}
          </button>
        )}
        {!isDone(1) && (
          <button
            onClick={() => onAdvance(task, "Arrived at Pickup")}
            disabled={isUpdating || !isUnlocked(1)}
            className="customer-button bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isActive("Arrived at Pickup") ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-xs" />
                Updating...
              </span>
            ) : (
              "Arrive"
            )}
          </button>
        )}
        {!isDone(2) && (
          <button
            onClick={() => onAdvance(task, "Pickup Completed")}
            disabled={isUpdating || !isUnlocked(2)}
            className="customer-button bg-green-600 text-white rounded-lg px-3 py-2 col-span-2 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isActive("Pickup Completed") ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-xs" />
                Updating...
              </span>
            ) : (
              "Confirm Pickup"
            )}
          </button>
        )}
        {!isDone(3) && (
          <button
            onClick={() => onAdvance(task, "dropped at origin hub")}
            disabled={isUpdating || !isUnlocked(3)}
            className="customer-button bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg px-3 py-2 col-span-2 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isActive("dropped at origin hub") ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-xs" />
                Updating...
              </span>
            ) : (
              "Mark Dropped at Warehouse"
            )}
          </button>
        )}
        <button
          onClick={() => onRoute(task)}
          disabled={isUpdating}
          className="customer-button bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 col-span-2 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          View Route to Pickup
        </button>
      </div>
    </div>
  );
}
