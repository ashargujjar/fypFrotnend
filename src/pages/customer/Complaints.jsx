import Topbar from "./components/Topbar";
import { useEffect, useRef, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Complaints() {
  const [complaintText, setComplaintText] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [isLoadingShipments, setIsLoadingShipments] = useState(true);
  const [shipmentLoadError, setShipmentLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const complaintsHistory = [
    {
      id: "C-001",
      shipmentId: "SS-1012",
      issue: "Delay in delivery",
      status: "Pending",
      date: "2025-01-18",
    },
    {
      id: "C-002",
      shipmentId: "SS-1090",
      issue: "Parcel damaged",
      status: "Resolved",
      date: "2025-01-15",
    },
  ];

  const getStatusColor = (status) => {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "resolved") return "bg-green-100 text-green-700";
    if (normalized === "pending") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const getShipmentValue = (shipment) =>
    shipment?._id || shipment?.id || shipment?.shipmentId || "";
  const getShipmentLabel = (shipment) =>
    shipment?.shipmentId || shipment?.id || shipment?._id || "";
  const getDisplayId = (value) => {
    const id = String(value || "");
    if (!id) return "";
    if (id.startsWith("SS-") || id.length <= 12) return id;
    return `${id.slice(0, 6)}...${id.slice(-4)}`;
  };
  const selectedShipment = shipments.find(
    (shipment) => getShipmentValue(shipment) === shipmentId
  );
  const selectedLabel = getShipmentLabel(selectedShipment);

  useEffect(() => {
    let isMounted = true;

    const loadShipments = async () => {
      try {
        setShipmentLoadError("");
        const res = await fetch(`${API_URL}/shipment/getShipments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Unable to load shipments.");
        }
        const list = Array.isArray(data?.shipments)
          ? data.shipments
          : Array.isArray(data)
            ? data
            : [];
        if (isMounted) setShipments(list);
      } catch (error) {
        if (isMounted)
          setShipmentLoadError(error?.message || "Unable to load shipments.");
      } finally {
        if (isMounted) setIsLoadingShipments(false);
      }
    };

    if (token) {
      loadShipments();
    } else {
      setShipmentLoadError("Missing auth token.");
      setIsLoadingShipments(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setSubmitError("");
    setSubmitSuccess("");

    if (!token) {
      setSubmitError("Missing auth token.");
      return;
    }
    if (!shipmentId || !category || !complaintText) {
      setSubmitError("Please fill out all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("shipmentId", shipmentId);
      formData.append("category", category);
      formData.append("complaintText", complaintText);
      if (image) formData.append("image", image);

      const res = await fetch(`${API_URL}/complaint/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const raw = await res.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch (parseError) {
        console.error("Complaint submit: response is not JSON", raw);
      }
      if (!res.ok) {
        console.error("Complaint submit failed", {
          status: res.status,
          statusText: res.statusText,
          body: data ?? raw,
        });
        throw new Error(data?.message || "Unable to submit complaint.");
      }

      setSubmitSuccess(data?.message || "Complaint submitted successfully.");
      setComplaintText("");
      setShipmentId("");
      setCategory("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Complaint submit error", error);
      setSubmitError(error?.message || "Unable to submit complaint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Topbar />

      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">Complaints</h1>

        {/* NEW COMPLAINT FORM */}
        <div className="bg-white shadow rounded-xl p-8 mb-10">
          <h2 className="text-xl font-bold text-primary mb-6">
            Submit a Complaint
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipment ID */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Shipment ID
              </label>
              <select
                className="w-full md:max-w-[260px] min-w-0 p-3 border rounded-lg outline-none focus:border-primary truncate"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                disabled={
                  isLoadingShipments ||
                  !!shipmentLoadError ||
                  shipments.length === 0
                }
                title={selectedLabel}
              >
                <option value="">
                  {isLoadingShipments
                    ? "Loading shipments..."
                    : shipmentLoadError
                      ? "Unable to load shipments"
                      : shipments.length === 0
                        ? "No shipments available"
                        : "Select Shipment"}
                </option>
                {shipments.map((shipment) => {
                  const value = getShipmentValue(shipment);
                  const label = getShipmentLabel(shipment);
                  if (!value) return null;
                  return (
                    <option key={value} value={value} title={label}>
                      {getDisplayId(label)}
                    </option>
                  );
                })}
              </select>
              {isLoadingShipments ? (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <span className="loading loading-spinner loading-xs" />
                  Loading shipments...
                </div>
              ) : shipmentLoadError ? (
                <p className="text-xs text-red-600 mt-2">{shipmentLoadError}</p>
              ) : null}
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category
              </label>
              <select
                className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Select Category</option>
                <option>Delayed Delivery</option>
                <option>Damaged Parcel</option>
                <option>Wrong Delivery</option>
                <option>Rider Behavior</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-1">
              Complaint Description
            </label>
            <textarea
              rows="4"
              className="w-full p-3 border rounded-lg outline-none focus:border-primary"
              placeholder="Explain the issue in detail..."
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-1">
              Attach an Image (Optional)
            </label>
            <input
              type="file"
              className="block w-full p-3 bg-white border rounded-lg"
              onChange={(e) => setImage(e.target.files[0])}
              ref={fileInputRef}
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-8 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm" />
                Submitting...
              </span>
            ) : (
              "Submit Complaint"
            )}
          </button>
          {submitSuccess ? (
            <p className="text-sm text-green-600 mt-3">{submitSuccess}</p>
          ) : null}
          {submitError ? (
            <p className="text-sm text-red-600 mt-3">{submitError}</p>
          ) : null}
        </div>

        {/* COMPLAINT HISTORY */}
        <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
          <h2 className="text-xl font-bold text-primary mb-4">
            Complaint History
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600">
                <th className="p-3">Complaint ID</th>
                <th className="p-3">Shipment ID</th>
                <th className="p-3">Issue</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {complaintsHistory.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-semibold text-primary">{c.id}</td>
                  <td className="p-3">{c.shipmentId}</td>
                  <td className="p-3">{c.issue}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(c.status)}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
