import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { useMemo, useState } from "react";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString()}`;
const inputClass =
  "p-3 border rounded-lg outline-none focus:border-primary border-gray-300";

export default function BookShipment() {
  const [paymentType, setPaymentType] = useState("COD");
  const [codAmount, setCodAmount] = useState("");
  const [useWallet, setUseWallet] = useState(true);
  const [prepaidSource, setPrepaidSource] = useState("wallet");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    senderName: "",
    senderPhone: "",
    pickupAddress: "",
    receiverName: "",
    receiverPhone: "",
    deliveryAddress: "",
    weight: "",
    packageType: "",
    notes: "",
  });

  const deliveryCharge = useMemo(() => {
    const weight = parseFloat(form.weight) || 0;
    const base = 250;
    const weightExtra = Math.max(weight - 1, 0) * 80;
    return Math.round(base + weightExtra);
  }, [form.weight]);

  const netToWallet = useMemo(() => {
    if (!codAmount) return 0;
    const cod = Number(codAmount) || 0;
    const fee = Number(deliveryCharge) || 0;
    return useWallet ? Math.max(cod - fee, 0) : cod;
  }, [codAmount, deliveryCharge, useWallet]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    const requiredFields = [
      "senderName",
      "senderPhone",
      "pickupAddress",
      "receiverName",
      "receiverPhone",
      "deliveryAddress",
      "weight",
      "packageType",
    ];

    requiredFields.forEach((field) => {
      if (!form[field]) nextErrors[field] = "Required";
    });

    if (paymentType === "COD" && !codAmount) {
      nextErrors.codAmount = "Enter COD amount";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    // Placeholder submit: replace with API integration.
    alert("Shipment captured. Wire this handler to your backend next.");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Area */}
      <div className="flex-1">
        <Topbar />

        <div className="p-4 sm:p-6 md:p-8">
          {/* TITLE */}
          <h1 className="text-2xl font-bold text-primary mb-6">
            Book a New Shipment
          </h1>

          <form
            className="bg-white shadow rounded-xl p-8 space-y-10"
            onSubmit={handleSubmit}
          >
            {/* SENDER INFO */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Sender Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Sender Name"
                  value={form.senderName}
                  onChange={(e) => handleChange("senderName", e.target.value)}
                  className={`${inputClass} ${
                    errors.senderName ? "border-red-400" : ""
                  }`}
                />
                <input
                  type="text"
                  placeholder="Sender Phone"
                  value={form.senderPhone}
                  onChange={(e) => handleChange("senderPhone", e.target.value)}
                  className={`${inputClass} ${
                    errors.senderPhone ? "border-red-400" : ""
                  }`}
                />
                <input
                  type="text"
                  placeholder="Pickup Address"
                  value={form.pickupAddress}
                  onChange={(e) => handleChange("pickupAddress", e.target.value)}
                  className={`md:col-span-2 ${inputClass} ${
                    errors.pickupAddress ? "border-red-400" : ""
                  }`}
                />
              </div>
            </div>

            {/* RECEIVER INFO */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Receiver Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Receiver Name"
                  value={form.receiverName}
                  onChange={(e) => handleChange("receiverName", e.target.value)}
                  className={`${inputClass} ${
                    errors.receiverName ? "border-red-400" : ""
                  }`}
                />
                <input
                  type="text"
                  placeholder="Receiver Phone"
                  value={form.receiverPhone}
                  onChange={(e) =>
                    handleChange("receiverPhone", e.target.value)
                  }
                  className={`${inputClass} ${
                    errors.receiverPhone ? "border-red-400" : ""
                  }`}
                />
                <input
                  type="text"
                  placeholder="Delivery Address"
                  value={form.deliveryAddress}
                  onChange={(e) =>
                    handleChange("deliveryAddress", e.target.value)
                  }
                  className={`md:col-span-2 ${inputClass} ${
                    errors.deliveryAddress ? "border-red-400" : ""
                  }`}
                />
              </div>
            </div>

            {/* PACKAGE INFO */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Package Details
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={form.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  className={`${inputClass} ${
                    errors.weight ? "border-red-400" : ""
                  }`}
                />
                <input
                  type="text"
                  placeholder="Package Type (Electronics, Food, etc)"
                  value={form.packageType}
                  onChange={(e) => handleChange("packageType", e.target.value)}
                  className={`md:col-span-2 ${inputClass} ${
                    errors.packageType ? "border-red-400" : ""
                  }`}
                />
              </div>

              <textarea
                placeholder="Additional Notes (Optional)"
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className={`w-full mt-4 ${inputClass}`}
                rows="3"
              ></textarea>
            </div>

            {/* PAYMENT METHOD */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Payment Method
              </h2>

              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentType === "COD"}
                    onChange={() => setPaymentType("COD")}
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentType === "Prepaid"}
                    onChange={() => setPaymentType("Prepaid")}
                  />
                  <span>Prepaid (Online Payment)</span>
                </label>
              </div>

              {paymentType === "COD" && (
                <div className="mt-6 space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <label className="flex-1 text-sm text-gray-700">
                      Amount to collect from customer (COD)
                      <input
                        type="number"
                        min="0"
                        value={codAmount}
                        onChange={(e) => setCodAmount(e.target.value)}
                        placeholder="Enter COD amount e.g. 2200"
                        className={`mt-1 w-full ${inputClass} ${
                          errors.codAmount ? "border-red-400" : ""
                        }`}
                      />
                    </label>
                    <div className="flex-1 text-sm text-gray-700">
                      Delivery charges (auto)
                      <div className="mt-1 w-full p-3 border rounded-lg bg-gray-100 text-gray-700">
                        {formatCurrency(deliveryCharge)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-calculated by system (distance/weight). Not editable.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                    />
                    Use wallet balance to pay delivery charges (off = keep full COD)
                  </label>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <SummaryCard
                      label="COD to collect"
                      value={formatCurrency(codAmount || 0)}
                    />
                    <SummaryCard
                      label="Delivery charges"
                      value={formatCurrency(deliveryCharge || 0)}
                      hint={useWallet ? "Paid from wallet" : "No wallet deduction"}
                    />
                    <SummaryCard
                      label="Net to your wallet"
                      value={formatCurrency(netToWallet)}
                      accent
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Riders will see the COD amount to collect. If wallet is on, we deduct
                    delivery charges from balance; if off, we keep the full COD amount
                    posting to your wallet.
                  </p>
                </div>
              )}

              {paymentType === "Prepaid" && (
                <div className="mt-6 space-y-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-gray-700">
                        Delivery charges to pay now:{" "}
                        <span className="font-semibold text-primary">
                          {formatCurrency(deliveryCharge)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        COD is not needed for prepaid. Riders will not collect cash.
                      </p>
                    </div>
                    <div className="flex-1 text-sm text-gray-700">
                      Pay from
                      <div className="mt-2 flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="prepaidSource"
                            checked={prepaidSource === "wallet"}
                            onChange={() => setPrepaidSource("wallet")}
                          />
                          Wallet balance
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="prepaidSource"
                            checked={prepaidSource === "card"}
                            onChange={() => setPrepaidSource("card")}
                          />
                          Card / online payment
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRICE ESTIMATE */}
              <div className="mt-6 bg-light p-4 rounded-lg border">
                <p className="text-sm text-gray-600">
                  Toggle wallet to decide how you want to handle charges: ON = deduct from
                  wallet; OFF = keep the full COD as your incoming amount.
                </p>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                We'll show riders the COD amount and delivery notes. Charges marked
                "from wallet" will be netted off before settlement.
              </p>
              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Confirm Shipment Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent, hint }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white">
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-xl font-bold ${
          accent ? "text-primary" : "text-gray-800"
        }`}
      >
        {value}
      </p>
      {hint && <p className="text-[11px] text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
