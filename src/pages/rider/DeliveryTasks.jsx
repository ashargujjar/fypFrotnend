import { useState } from "react";
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

const buildOtpFromBoxes = (currentValue, index, nextChar) => {
  const sanitized = (nextChar || "").replace(/\D/g, "");
  const chars = (currentValue || "").split("");
  while (chars.length < 4) chars.push("");
  chars[index] = sanitized.slice(-1);
  return chars.slice(0, 4).join("");
};

export default function DeliveryTasks() {
  const [tasks, setTasks] = useState(
    demoDeliveries.filter(
      (t) => t.origin_city === t.destination_city // hide intercity tasks for delivery riders
    )
  );
  const [statusMap, setStatusMap] = useState({});
  const [routePreview, setRoutePreview] = useState(null);
  const [otpInputs, setOtpInputs] = useState({});
  const [otpVerified, setOtpVerified] = useState({});
  const [collectingOtp, setCollectingOtp] = useState({});
  const [otpError, setOtpError] = useState({});

  const setStatus = (id, status) =>
    setStatusMap((prev) => ({ ...prev, [id]: status }));

  const complete = (id) => {
    setStatus(id, "Delivered");
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRoute = (task) => {
    setRoutePreview({
      from: "Your current location",
      to: task.dropoff,
      label: `Route to delivery for ${task.shipmentId}`,
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      <RiderSidebar />
      <div className="flex-1">
        <RiderTopbar />

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Delivery Tasks
              </h1>
              <p className="text-gray-600">
                Final-mile only. Intercity legs stay hidden until parcels reach
                destination hubs.
              </p>
            </div>
            <span className="text-sm bg-white border px-3 py-1 rounded-full shadow">
              Pending: {tasks.length}
            </span>
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
              />
            ))}
            {tasks.length === 0 && (
              <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500 col-span-full">
                No delivery tasks yet. Check back after hub receives parcels.
              </div>
            )}
          </div>

          {routePreview && (
            <div className="bg-white rounded-xl shadow p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Map Preview</p>
                  <h3 className="text-lg font-bold text-primary">
                    {routePreview.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    From: {routePreview.from} | To: {routePreview.to}
                  </p>
                </div>
                <button
                  className="text-sm text-gray-500 hover:text-primary"
                  onClick={() => setRoutePreview(null)}
                >
                  Close
                </button>
              </div>
              <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                Map will render here (delivery route)
              </div>
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
}) {
  return (
    <div className="bg-white shadow rounded-xl p-5 space-y-3">
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
          <strong>Drop-off:</strong> {task.dropoff}
        </p>
        <p>
          <strong>Receiver:</strong> {task.receiver}
        </p>
        <p>
          <strong>COD:</strong> Rs {task.cod}
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
          <div className="flex items-center gap-2">
            <input
              type="text"
              maxLength={4}
              value={otpValue}
              onChange={(e) =>
                onOtpChange(task.id, e.target.value.replace(/\\D/g, ""))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 w-24 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/40"
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
        <button
          onClick={() => onComplete(task.id)}
          className="bg-green-600 text-white rounded-lg px-3 py-2 w-full hover:bg-green-700"
        >
          Delivery Completed (POD)
        </button>
      )}
    </div>
  );
}
