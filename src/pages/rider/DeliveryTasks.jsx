import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RiderTopbar from "./components/RiderTopbar";
import { toastError, toastSuccess } from "../../utils/toast";
const API_URL = import.meta.env.VITE_API_URL;

const normalize = (value) => String(value || "").trim();
const normalizeStatus = (value) => normalize(value).toLowerCase();
const isDeliveredStatus = (value) => normalizeStatus(value).includes("delivered");

const getDeliveryStepIndex = (value) => {
  const status = normalizeStatus(value);
  if (!status) return -1;
  if (status.includes("delivered")) return 4;
  if (status.includes("pin verified")) return 3;
  if (status.includes("collecting pin")) return 2;
  if (status.includes("arrived")) return 1;
  if (status.includes("out for delivery")) return 0;
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

const buildDeliveryTasks = (list) =>
  list.map((task, index) => {
    const shipment = resolveShipment(task);
    const shipmentId = normalizeId(
      shipment?._id || shipment?.id || task?.shipmentId,
    );
    const taskId = normalizeId(task?._id || task?.id) || `DL-${index + 1}`;
    const codAmount = shipment?.codAmount ?? shipment?.cod ?? 0;
    const otp = shipment?.otp || shipment?.deliveryOtp || shipment?.pin || "";
    const status =
      task?.status ||
      shipment?.riderStatus ||
      shipment?.status ||
      "Assigned";

    return {
      id: taskId,
      shipmentId: shipmentId || "-",
      dropoff: shipment?.deliveryAddress || "N/A",
      deliveryZone: shipment?.deliveryZone || shipment?.destination_zone || "",
      deliveryLat: shipment?.deliveryLat ?? null,
      deliveryLng: shipment?.deliveryLng ?? null,
      receiver: shipment?.receiverName || "N/A",
      cod: Number(codAmount) || 0,
      notes: shipment?.notes || "No notes provided.",
      otp,
      iotDeviceId: shipment?.iotDeviceId || "",
      iotStatus: shipment?.iotStatus || "none",
      origin_city: shipment?.pickupCity || shipment?.origin_city || "",
      destination_city:
        shipment?.deliveryCity || shipment?.destination_city || "",
      status,
    };
  });

export default function DeliveryTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingMap, setUpdatingMap] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [otpInputs, setOtpInputs] = useState({});
  const [otpVerified, setOtpVerified] = useState({});
  const [collectingOtp, setCollectingOtp] = useState({});
  const [otpError, setOtpError] = useState({});
  const [otpSending, setOtpSending] = useState({});
  const [otpVerifying, setOtpVerifying] = useState({});
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
          throw new Error(data?.message || "Unable to load delivery tasks.");
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
          const nextTasks = buildDeliveryTasks(list).filter(
            (task) => !isDeliveredStatus(task.status),
          );
          setTasks(nextTasks);
          if (showLoader) setLoadError("");
        }
      } catch (error) {
        if (isMounted) {
          if (showLoader) {
            setLoadError(error?.message || "Unable to load delivery tasks.");
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

  const advance = async (task, status, { onSuccess, onError } = {}) => {
    const taskId = task?.id;
    const shipmentId = task?.shipmentId;
    if (!taskId) return false;
    if (updatingMap[taskId]) return false;

    const previousStatus = statusMap[taskId] || task?.status || "Assigned";
    setActionError("");
    setUpdatingMap((prev) => ({ ...prev, [taskId]: status }));
    setStatus(taskId, status);

    try {
      await updateShipmentStatus(shipmentId, status);
      toastSuccess(`Status updated: ${status}`);
      if (status === "Delivered") {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      setStatus(taskId, previousStatus);
      setActionError(error?.message || "Unable to update shipment status.");
      toastError(error?.message || "Unable to update shipment status.");
      if (onError) onError(error);
      return false;
    } finally {
      setUpdatingMap((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    }
  };

  const handleRoute = (task) => {
    const destination = [
      task.dropoff,
      task.deliveryZone,
      task.destination_city,
      "Pakistan",
    ]
      .filter(Boolean)
      .join(", ");
    const hasCoords =
      Number.isFinite(Number(task.deliveryLat)) &&
      Number.isFinite(Number(task.deliveryLng));
    navigate("/rider/route", {
      state: {
        title: `Route to delivery for ${task.shipmentId}`,
        from: "Your current location",
        to: destination,
        routeType: "delivery",
        deliveryAddressFull: destination,
        toCoords: hasCoords
          ? { lat: Number(task.deliveryLat), lng: Number(task.deliveryLng) }
          : null,
        toLabel: task.dropoff,
        note: `Delivery task ${task.id}`,
      },
    });
  };

  const handleOtpChange = (id, value) => {
    setOtpInputs((prev) => ({ ...prev, [id]: value }));
    setOtpError((prev) => ({ ...prev, [id]: "" }));
  };

  const requestDeliveryPin = async (task, { successMessage } = {}) => {
    const taskId = task?.id;
    if (!taskId) return false;
    if (otpSending[taskId]) return false;

    setOtpSending((prev) => ({ ...prev, [taskId]: true }));
    try {
      await sendDeliveryPin(task?.shipmentId);
      setOtpError((prev) => ({ ...prev, [taskId]: "" }));
      if (successMessage) {
        toastSuccess(successMessage);
      }
      return true;
    } catch (error) {
      const message = error?.message || "Unable to send PIN.";
      setOtpError((prev) => ({ ...prev, [taskId]: message }));
      toastError(message);
      return false;
    } finally {
      setOtpSending((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    }
  };

  const handleVerifyOtp = async (task) => {
    const taskId = task?.id;
    const value = (otpInputs[taskId] || "").trim();

    if (!value || value.length !== 4) {
      setOtpError((prev) => ({ ...prev, [taskId]: "Enter 4-digit PIN" }));
      setOtpVerified((prev) => ({ ...prev, [taskId]: false }));
      toastError("Enter a valid 4-digit PIN.");
      return;
    }

    if (otpVerifying[taskId]) return;
    setOtpVerifying((prev) => ({ ...prev, [taskId]: true }));
    try {
      await verifyDeliveryPin(task?.shipmentId, value);
      setOtpVerified((prev) => ({ ...prev, [taskId]: true }));
      setOtpError((prev) => ({ ...prev, [taskId]: "" }));
      setStatus(taskId, "PIN Verified");
      toastSuccess("PIN verified successfully.");
    } catch (error) {
      const message = error?.message || "Unable to verify PIN.";
      setOtpVerified((prev) => ({ ...prev, [taskId]: false }));
      setOtpError((prev) => ({ ...prev, [taskId]: message }));
      toastError(message);
    } finally {
      setOtpVerifying((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    }
  };

  const startCollectingOtp = async (task) => {
    const sent = await requestDeliveryPin(task, {
      successMessage: "Verification PIN sent to customer email.",
    });
    if (sent) {
      setCollectingOtp((prev) => ({ ...prev, [task.id]: true }));
      await advance(task, "Collecting PIN");
    }
  };

  const handleResendOtp = async (task) => {
    await requestDeliveryPin(task, {
      successMessage: "PIN resent to customer email.",
    });
  };


  const sendDeliveryPin = async (shipmentId) => {
    if (!shipmentId || shipmentId === "-") {
      throw new Error("Missing shipment id.");
    }
    if (!token) {
      throw new Error("Missing auth token.");
    }
    const endpoint = API_URL
      ? `${API_URL}/rider/sendDeliveryPin`
      : "/rider/sendDeliveryPin";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shipmentId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Unable to send PIN.");
    }
    return data;
  };

  const verifyDeliveryPin = async (shipmentId, pin) => {
    if (!shipmentId || shipmentId === "-") {
      throw new Error("Missing shipment id.");
    }
    if (!token) {
      throw new Error("Missing auth token.");
    }
    const endpoint = API_URL
      ? `${API_URL}/rider/verifyDeliveryPin`
      : "/rider/verifyDeliveryPin";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shipmentId, pin }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || "Unable to verify PIN.");
    }
    return data;
  };


  const statusCounts = tasks.reduce(
    (acc, task) => {
      const rawStatus = statusMap[task.id] || task.status || "Assigned";
      const status = normalizeStatus(rawStatus);
      acc.total += 1;
      if (
        status === "assigned" ||
        status === "delivery assigned" ||
        status === "delivery rider assigned"
      ) {
        acc.assigned += 1;
      } else if (status === "out for delivery" || status === "arrived") {
        acc.inProgress += 1;
      } else if (status === "pin verified") {
        acc.verified += 1;
      } else {
        acc.other += 1;
      }
      return acc;
    },
    { total: 0, assigned: 0, inProgress: 0, verified: 0, other: 0 },
  );

  return (
    <div className="min-h-screen bg-light customer-page">
      <RiderTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">My Assignments</h1>
            <p className="text-gray-600">
              Final-mile only. Intercity legs stay hidden until parcels reach
              destination hubs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="customer-card bg-white px-3 py-1 rounded-full text-slate-600">
              Assigned: {statusCounts.assigned}
            </span>
            <span className="customer-card bg-white px-3 py-1 rounded-full text-slate-600">
              In Progress: {statusCounts.inProgress}
            </span>
            <span className="customer-card bg-white px-3 py-1 rounded-full text-slate-600">
              PIN Verified: {statusCounts.verified}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <DeliveryCard
              key={task.id}
              task={task}
              status={statusMap[task.id] || task.status || "Assigned"}
              onAdvance={advance}
              onComplete={(item) => advance(item, "Delivered")}
              onRoute={handleRoute}
              otpValue={otpInputs[task.id] || ""}
              onOtpChange={handleOtpChange}
              onVerifyOtp={handleVerifyOtp}
              onResendOtp={handleResendOtp}
              isVerified={!!otpVerified[task.id]}
              showOtp={!!collectingOtp[task.id]}
              startCollectingOtp={startCollectingOtp}
              otpError={otpError[task.id]}
              isOtpSending={!!otpSending[task.id]}
              isOtpVerifying={!!otpVerifying[task.id]}
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
              Loading delivery tasks...
            </div>
          )}
          {!isLoading && loadError && (
            <div className="customer-card bg-white rounded-xl p-6 text-center text-red-600 col-span-full">
              {loadError}
            </div>
          )}
          {!isLoading && !loadError && tasks.length === 0 && (
            <div className="customer-card bg-white rounded-xl p-6 text-center text-gray-500 col-span-full">
              No delivery tasks yet. Check back after hub receives parcels.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeliveryCard({
  task,
  status,
  onAdvance,
  onComplete,
  onRoute,
  otpValue,
  onOtpChange,
  onVerifyOtp,
  onResendOtp,
  isVerified,
  showOtp,
  startCollectingOtp,
  otpError,
  isOtpSending,
  isOtpVerifying,
  updatingStatus,
}) {
  const statusStyles = {
    Assigned: "bg-slate-50 text-slate-700 border border-slate-200",
    Unassigned: "bg-gray-50 text-gray-600 border border-gray-200",
    "Out for Delivery": "bg-blue-50 text-blue-700 border border-blue-100",
    Arrived: "bg-amber-50 text-amber-700 border border-amber-100",
    "Collecting PIN": "bg-purple-50 text-purple-700 border border-purple-100",
    "PIN Verified": "bg-emerald-50 text-emerald-700 border border-emerald-100",
    Delivered: "bg-green-50 text-green-700 border border-green-100",
  };
  const statusClass =
    statusStyles[status] ||
    "bg-slate-50 text-slate-700 border border-slate-200";
  const codLabel = task.cod > 0 ? `Rs ${task.cod}` : "Prepaid";
  const normalizedStatus = normalizeStatus(status);
  const currentStep = getDeliveryStepIndex(status);
  const isDone = (stepIndex) => currentStep >= stepIndex;
  const isUnlocked = (stepIndex) => currentStep >= stepIndex - 1;
  const isUpdating = Boolean(updatingStatus);
  const isSendingOtp = Boolean(isOtpSending);
  const isVerifyingOtp = Boolean(isOtpVerifying);
  const isActive = (nextStatus) => updatingStatus === nextStatus;
  const isCollectingStatus =
    normalizedStatus.includes("collecting pin") ||
    normalizedStatus.includes("pin verified") ||
    normalizedStatus.includes("delivered");
  const isVerifiedStatus =
    normalizedStatus.includes("pin verified") ||
    normalizedStatus.includes("delivered");
  const showOtpSection = showOtp || isCollectingStatus;
  const verified = isVerified || isVerifiedStatus;

  return (
    <div className="customer-card customer-card-elevate bg-white rounded-xl p-5 space-y-4 transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Shipment {task.shipmentId}</p>
          <h3 className="text-lg font-bold text-primary">{task.id}</h3>
          <p className="text-xs text-gray-500 mt-1">Drop-off: {task.dropoff}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs ${statusClass}`}>
          {status}
        </span>
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <strong>Receiver:</strong> {task.receiver}
        </p>
        <p>
          <strong>COD:</strong> {codLabel}
        </p>
        <p className="text-gray-500">{task.notes}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {!isDone(0) && (
          <button
            onClick={() => onAdvance(task, "Out for Delivery")}
            disabled={isUpdating || !isUnlocked(0)}
            className="customer-button bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isActive("Out for Delivery") ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-xs" />
                Updating...
              </span>
            ) : (
              "Start Delivery"
            )}
          </button>
        )}
        {!isDone(1) && (
          <button
            onClick={() => onAdvance(task, "Arrived")}
            disabled={isUpdating || !isUnlocked(1)}
            className="customer-button bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isActive("Arrived") ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-xs" />
                Updating...
              </span>
            ) : (
              "Arrived"
            )}
          </button>
        )}
        {!isDone(2) && (
          <button
            onClick={() => startCollectingOtp(task)}
            disabled={isUpdating || isSendingOtp || !isUnlocked(2)}
            className="customer-button bg-primary text-white rounded-lg px-3 py-2 col-span-2 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSendingOtp ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-xs" />
                Sending...
              </span>
            ) : isActive("Collecting PIN") ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-xs" />
                Updating...
              </span>
            ) : (
              "Collect PIN"
            )}
          </button>
        )}
        <button
          onClick={() => onRoute(task)}
          disabled={isUpdating}
          className="customer-button bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 col-span-2 hover:bg-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          View Route to Drop-off
        </button>
      </div>

      {showOtpSection && !isDone(4) && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <p className="text-sm font-semibold text-primary">
            Enter 4-digit PIN sent to customer
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="\\d*"
              maxLength={4}
              value={otpValue}
              onChange={(e) => onOtpChange(task.id, e.target.value)}
              placeholder="Enter 4-digit PIN"
              className="customer-input border border-gray-300 rounded-lg px-3 py-2 w-44"
            />
            {!verified && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onVerifyOtp(task)}
                  disabled={isUpdating || isVerifyingOtp || isSendingOtp || !isUnlocked(3)}
                  className="customer-button bg-primary text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isVerifyingOtp ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="loading loading-spinner loading-xs" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify PIN"
                  )}
                </button>
                <button
                  onClick={() => onResendOtp(task)}
                  disabled={isUpdating || isSendingOtp || isVerifyingOtp}
                  className="customer-button bg-white text-primary border border-primary/40 px-3 py-2 rounded-lg hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSendingOtp ? "Resending..." : "Resend PIN"}
                </button>
              </div>
            )}
            {verified && (
              <span className="text-green-600 text-sm font-semibold">
                Verified
              </span>
            )}
          </div>
          {otpError && <p className="text-red-600 text-xs">{otpError}</p>}
        </div>
      )}

      {verified && !isDone(4) && (
        <div className="space-y-3">
          <button
            onClick={() => onComplete(task)}
            disabled={isUpdating}
            className={`customer-button rounded-lg px-3 py-2 w-full disabled:opacity-60 disabled:cursor-not-allowed ${
              "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isActive("Delivered") ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading loading-spinner loading-xs" />
                Updating...
              </span>
            ) : (
              "Delivery Completed (POD)"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
