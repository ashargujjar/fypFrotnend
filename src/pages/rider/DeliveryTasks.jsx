import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RiderSidebar from "./components/RiderSidebar";
import RiderTopbar from "./components/RiderTopbar";

const demoDeliveries = [
  {
    id: "DL-3301",
    shipmentId: "SS-22010",
    dropoff: "DHA Phase 6, Lahore",
    receiver: "Hassan Malik",
    cod: 2200,
    notes: "Call before arrival",
    otp: "3264",
    origin_city: "Lahore",
    destination_city: "Lahore",
  },
  {
    id: "DL-3302",
    shipmentId: "SS-22011",
    dropoff: "Bahria Town, Lahore",
    receiver: "Sara Ahmed",
    cod: 0,
    notes: "Prepaid",
    otp: "1452",
    origin_city: "Lahore",
    destination_city: "Lahore",
  },
  {
    id: "DL-3303",
    shipmentId: "SS-22003",
    dropoff: "Clifton Block 5, Karachi",
    receiver: "Umair Siddiqui",
    cod: 750,
    notes: "Fragile",
    otp: "9081",
    origin_city: "Faisalabad",
    destination_city: "Karachi", // hidden for delivery riders until destination hub handles
  },
];

export default function DeliveryTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(demoDeliveries);
  const [statusMap, setStatusMap] = useState({});
  const [otpInputs, setOtpInputs] = useState({});
  const [otpVerified, setOtpVerified] = useState({});
  const [collectingOtp, setCollectingOtp] = useState({});
  const [otpError, setOtpError] = useState({});
  const [iotDetachMap, setIotDetachMap] = useState({});

  const setStatus = (id, status) =>
    setStatusMap((prev) => ({ ...prev, [id]: status }));

  const complete = (id) => {
    setStatus(id, "Delivered");
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRoute = (task) => {
    navigate("/rider/route", {
      state: {
        title: `Route to delivery for ${task.shipmentId}`,
        from: "Your current location",
        to: task.dropoff,
        note: `Delivery task ${task.id}`,
      },
    });
  };

  const handleOtpChange = (id, value) => {
    setOtpInputs((prev) => ({ ...prev, [id]: value }));
    setOtpError((prev) => ({ ...prev, [id]: "" }));
  };

  const handleVerifyOtp = (task) => {
    const value = (otpInputs[task.id] || "").trim();

    if (value.length !== 4) {
      setOtpError((prev) => ({ ...prev, [task.id]: "Enter 4-digit PIN" }));
      setOtpVerified((prev) => ({ ...prev, [task.id]: false }));
      return;
    }

    if (value === task.otp) {
      setOtpVerified((prev) => ({ ...prev, [task.id]: true }));
      setOtpError((prev) => ({ ...prev, [task.id]: "" }));
      setStatus(task.id, "PIN Verified");
    } else {
      setOtpError((prev) => ({
        ...prev,
        [task.id]: "Incorrect PIN. Try again.",
      }));
      setOtpVerified((prev) => ({ ...prev, [task.id]: false }));
    }
  };

  const startCollectingOtp = (id) => {
    setCollectingOtp((prev) => ({ ...prev, [id]: true }));
    setStatus(id, "Collecting PIN");
  };

  const updateIotDetach = (id, updates) =>
    setIotDetachMap((prev) => ({
      ...prev,
      [id]: {
        deviceId: "",
        status: "Pending detach",
        ...prev[id],
        ...updates,
      },
    }));

  const statusCounts = tasks.reduce(
    (acc, task) => {
      const status = statusMap[task.id] || "Assigned";
      acc.total += 1;
      if (status === "Assigned") acc.assigned += 1;
      else if (status === "Out for Delivery" || status === "Arrived")
        acc.inProgress += 1;
      else if (status === "PIN Verified") acc.verified += 1;
      else acc.other += 1;
      return acc;
    },
    { total: 0, assigned: 0, inProgress: 0, verified: 0, other: 0 }
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      <RiderSidebar />
      <div className="flex-1">
        <RiderTopbar />

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-primary">My Assignments</h1>
              <p className="text-gray-600">
                Final-mile only. Intercity legs stay hidden until parcels reach
                destination hubs.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-white border px-3 py-1 rounded-full shadow">
                Assigned: {statusCounts.assigned}
              </span>
              <span className="bg-white border px-3 py-1 rounded-full shadow">
                In Progress: {statusCounts.inProgress}
              </span>
              <span className="bg-white border px-3 py-1 rounded-full shadow">
                PIN Verified: {statusCounts.verified}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <DeliveryCard
                key={task.id}
                task={task}
                status={statusMap[task.id] || "Assigned"}
                onComplete={complete}
                onStatus={setStatus}
                onRoute={handleRoute}
                otpValue={otpInputs[task.id] || ""}
                onOtpChange={handleOtpChange}
                onVerifyOtp={handleVerifyOtp}
                isVerified={!!otpVerified[task.id]}
                showOtp={!!collectingOtp[task.id]}
                startCollectingOtp={startCollectingOtp}
                otpError={otpError[task.id]}
                iotDetachState={iotDetachMap[task.id]}
                onIotDetachChange={updateIotDetach}
              />
            ))}
            {tasks.length === 0 && (
              <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500 col-span-full">
                No delivery tasks yet. Check back after hub receives parcels.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function DeliveryCard({
  task,
  status,
  onStatus,
  onComplete,
  onRoute,
  otpValue,
  onOtpChange,
  onVerifyOtp,
  isVerified,
  showOtp,
  startCollectingOtp,
  otpError,
  iotDetachState,
  onIotDetachChange,
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
    statusStyles[status] || "bg-slate-50 text-slate-700 border border-slate-200";
  const codLabel = task.cod > 0 ? `Rs ${task.cod}` : "Prepaid";
  const iotDetach = iotDetachState || {
    deviceId: "",
    status: "Pending detach",
  };
  const isDetached = iotDetach.status === "Device detached";

  return (
    <div className="bg-white shadow rounded-xl p-5 space-y-4 border border-transparent hover:border-primary/20 transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">Shipment {task.shipmentId}</p>
          <h3 className="text-lg font-bold text-primary">{task.id}</h3>
          <p className="text-xs text-gray-500 mt-1">
            Drop-off: {task.dropoff}
          </p>
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
        <button
          onClick={() => onStatus(task.id, "Out for Delivery")}
          className="bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-blue-100"
        >
          Start Delivery
        </button>
        <button
          onClick={() => onStatus(task.id, "Arrived")}
          className="bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-blue-100"
        >
          Arrived
        </button>
        <button
          onClick={() => startCollectingOtp(task.id)}
          className="bg-primary text-white rounded-lg px-3 py-2 col-span-2 hover:bg-blue-700"
        >
          Collect PIN
        </button>
        <button
          onClick={() => onRoute(task)}
          className="bg-blue-50 text-primary border border-primary/30 rounded-lg px-3 py-2 col-span-2 hover:bg-blue-100"
        >
          View Route to Drop-off
        </button>
      </div>

      {showOtp && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <p className="text-sm font-semibold text-primary">
            Enter 4-digit PIN sent to customer
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="\\d*"
              maxLength={4}
              value={otpValue}
              onChange={(e) => onOtpChange(task.id, e.target.value)}
              placeholder="Enter 4-digit PIN"
              className="border border-gray-300 rounded-lg px-3 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={() => onVerifyOtp(task)}
              className="bg-primary text-white px-3 py-2 rounded-lg hover:bg-blue-700"
            >
              Verify PIN
            </button>
            {isVerified && (
              <span className="text-green-600 text-sm font-semibold">
                Verified
              </span>
            )}
          </div>
          {otpError && <p className="text-red-600 text-xs">{otpError}</p>}
        </div>
      )}

      {isVerified && (
        <div className="space-y-3">
          <div className="border rounded-lg p-3 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">Detach IoT Device</p>
              <span className="text-xs text-gray-500">{iotDetach.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <input
                type="text"
                value={iotDetach.deviceId}
                onChange={(e) =>
                  onIotDetachChange(task.id, { deviceId: e.target.value })
                }
                placeholder="Enter device ID to detach"
                className="border rounded-lg px-3 py-2 col-span-2"
              />
              <button
                onClick={() =>
                  onIotDetachChange(task.id, { status: "Device detached" })
                }
                className="bg-primary text-white rounded-lg px-3 py-2 col-span-2 hover:bg-blue-700"
              >
                Detach IoT Device
              </button>
            </div>
          </div>
          <button
            onClick={() => onComplete(task.id)}
            disabled={!isDetached}
            className={`rounded-lg px-3 py-2 w-full ${
              isDetached
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Delivery Completed (POD)
          </button>
        </div>
      )}
    </div>
  );
}
