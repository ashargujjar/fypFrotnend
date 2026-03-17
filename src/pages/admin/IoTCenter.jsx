import AdminTopbar from "./components/AdminTopbar";
import { useEffect, useState } from "react";
import { toastError, toastSuccess } from "../../utils/toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function IoTCenter() {
  const [devices, setDevices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState({});
  const [disableMap, setDisableMap] = useState({});
  const [form, setForm] = useState({
    deviceId: "",
    moduleType: "IoT Module",
    firmwareVersion: "",
    simNumber: "",
    status: "Available",
    notes: "",
  });
  const token = localStorage.getItem("token");

  const inputClass =
    "customer-input w-full px-4 py-3 border rounded-lg outline-none focus:border-primary";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const formatLastActive = (device) => {
    const value =
      device?.lastActiveAt || device?.updatedAt || device?.createdAt || null;
    if (!value) return "-";
    return new Date(value).toLocaleString();
  };

  const mapDevice = (device) => {
    const assignedRaw = device?.assignedShipmentId;
    let assignedTo = "-";
    if (assignedRaw) {
      if (typeof assignedRaw === "object") {
        assignedTo = assignedRaw._id || assignedRaw.id || "-";
      } else {
        assignedTo = String(assignedRaw);
      }
    }
    return {
      id: device?.deviceId || "-",
      type: device?.moduleType || "IoT Module",
      status: device?.status || "Available",
      assignedTo: assignedTo || "-",
      lastActive: formatLastActive(device),
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDevices = async () => {
      if (!token) {
        if (isMounted) {
          setLoadError("Missing admin token.");
          setIsLoading(false);
        }
        return;
      }
      try {
        setIsLoading(true);
        setLoadError("");
        const endpoint = API_URL
          ? `${API_URL}/admin/iot/devices`
          : "/admin/iot/devices";
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to fetch devices.");
        }
        const list = Array.isArray(data?.devices)
          ? data.devices
          : Array.isArray(data)
            ? data
            : [];
        if (isMounted) {
          setDevices(list.map(mapDevice));
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error?.message || "Unable to fetch devices.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDevices();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!token) {
      toastError("Missing admin token.");
      return;
    }
    const nextErrors = {};
    const trimmedId = String(form.deviceId || "").trim().toUpperCase();

    if (!trimmedId) nextErrors.deviceId = "Device ID is required.";
    if (
      trimmedId &&
      devices.some((device) => device.id.toLowerCase() === trimmedId.toLowerCase())
    ) {
      nextErrors.deviceId = "Device ID already exists.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = API_URL
        ? `${API_URL}/admin/iot/register`
        : "/admin/iot/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deviceId: trimmedId,
          moduleType: form.moduleType,
          firmwareVersion: form.firmwareVersion,
          simNumber: form.simNumber,
          status: form.status,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to register device.");
      }
      const device = data?.device || data;
      setDevices((prev) => [mapDevice(device), ...prev]);
      setForm({
        deviceId: "",
        moduleType: "IoT Module",
        firmwareVersion: "",
        simNumber: "",
        status: "Available",
        notes: "",
      });
      setShowForm(false);
      toastSuccess("IoT device registered.");
    } catch (error) {
      toastError(error?.message || "Unable to register device.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisable = async (deviceId) => {
    if (!token) {
      toastError("Missing admin token.");
      return;
    }
    if (!deviceId || disableMap[deviceId]) return;
    setDisableMap((prev) => ({ ...prev, [deviceId]: true }));
    try {
      const endpoint = API_URL
        ? `${API_URL}/admin/iot/disable/${deviceId}`
        : `/admin/iot/disable/${deviceId}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to disable device.");
      }
      const updated = data?.device || {};
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? {
                ...device,
                status: "Disabled",
                assignedTo: "-",
                lastActive: formatLastActive(updated) || device.lastActive,
              }
            : device,
        ),
      );
      toastSuccess("Device disabled.");
    } catch (error) {
      toastError(error?.message || "Unable to disable device.");
    } finally {
      setDisableMap((prev) => {
        const next = { ...prev };
        delete next[deviceId];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              IoT Sensor Center
            </h1>
            <p className="text-gray-600 text-sm">
              Admin has full control over IoT module inventory and assignments.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="customer-button bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {showForm ? "Close Form" : "Register New Device"}
            </button>
          </div>
        </div>
        {loadError ? (
          <div className="customer-card bg-white p-4 rounded-xl shadow text-sm text-red-600 mb-6">
            {loadError}
          </div>
        ) : null}

        <div className="customer-card bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-lg font-bold text-primary">Admin Controls</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="border border-slate-100 rounded-xl p-4 space-y-2 bg-slate-50/80">
              <p className="font-semibold">Register new IoT devices</p>
              <p className="text-gray-500">
                Add IoT modules (GPS + shock + temperature) into inventory.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="text-primary font-semibold"
              >
                Register Device
              </button>
            </div>
            <div className="border border-slate-100 rounded-xl p-4 space-y-2 bg-slate-50/80">
              <p className="font-semibold">Disable faulty devices</p>
              <p className="text-gray-500">
                Remove malfunctioning sensors from active assignments.
              </p>
              <button className="text-primary font-semibold">
                Disable Device
              </button>
            </div>
          </div>
        </div>

        {showForm ? (
          <div className="customer-card bg-white p-6 rounded-xl shadow mt-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-primary">
                Register IoT Device
              </h2>
              <p className="text-sm text-gray-500">
                Add a new IoT module to inventory and mark it as ready for
                assignment.
              </p>
            </div>

            <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="deviceId"
                  placeholder="Device ID (e.g., IOT-2005)"
                  value={form.deviceId}
                  onChange={handleChange}
                  className={`${inputClass} ${
                    errors.deviceId ? "border-red-400" : ""
                  }`}
                />
                {errors.deviceId ? (
                  <p className="text-xs text-red-600 mt-1">{errors.deviceId}</p>
                ) : null}
              </div>

              <select
                name="moduleType"
                value={form.moduleType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="IoT Module">IoT Module</option>
                <option value="GPS Tracker">GPS Tracker</option>
                <option value="Temperature Sensor">Temperature Sensor</option>
                <option value="Shock Sensor">Shock Sensor</option>
              </select>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Disabled">Disabled</option>
              </select>

              <input
                type="text"
                name="firmwareVersion"
                placeholder="Firmware Version (Optional)"
                value={form.firmwareVersion}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="text"
                name="simNumber"
                placeholder="SIM/IMEI Number (Optional)"
                value={form.simNumber}
                onChange={handleChange}
                className={inputClass}
              />

              <textarea
                name="notes"
                placeholder="Notes (Optional)"
                value={form.notes}
                onChange={handleChange}
                className={`${inputClass} md:col-span-2`}
                rows="3"
              />

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="customer-button bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-200 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="customer-button bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register Device"}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="customer-card bg-white p-6 rounded-xl shadow mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-bold text-primary">
              IoT Inventory List
            </h2>
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                Available
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                Assigned
              </span>
              <span className="px-3 py-1 rounded-full bg-red-50 text-red-700">
                Disabled
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Device ID</th>
                  <th className="py-2">Module</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Assigned To</th>
                  <th className="py-2">Last Active</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-gray-500"
                    >
                      Loading devices...
                    </td>
                  </tr>
                ) : devices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-gray-500"
                    >
                      No devices registered yet.
                    </td>
                  </tr>
                ) : (
                  devices.map((device) => (
                    <tr key={device.id} className="border-b">
                      <td className="py-3 font-semibold">{device.id}</td>
                      <td className="py-3">{device.type}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            device.status === "Available"
                              ? "bg-emerald-50 text-emerald-700"
                              : device.status === "Assigned"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {device.status}
                        </span>
                      </td>
                      <td className="py-3">{device.assignedTo}</td>
                      <td className="py-3">{device.lastActive}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleDisable(device.id)}
                            disabled={
                              device.status === "Disabled" ||
                              disableMap[device.id]
                            }
                            className="text-red-600 font-semibold disabled:text-red-300 disabled:cursor-not-allowed"
                          >
                            {device.status === "Disabled"
                              ? "Disabled"
                              : disableMap[device.id]
                              ? "Disabling..."
                              : "Disable"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
