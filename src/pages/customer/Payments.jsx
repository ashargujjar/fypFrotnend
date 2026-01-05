import Topbar from "./components/Topbar";
import { useEffect, useMemo, useState } from "react";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString()}`;
const API_URL = import.meta.env.VITE_API_URL;

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const token = localStorage.getItem("token");
  const bankAccounts = [
    { id: "acct-1", label: "UBL **** 2023" },
    { id: "acct-2", label: "Meezan **** 1190" },
  ];
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(
    bankAccounts[0]?.id || ""
  );
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadPayments = async () => {
      try {
        setLoadError("");
        const [paymentsRes, walletRes] = await Promise.all([
          fetch(`${API_URL}/payments/userPayments`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_URL}/user/walletBalance`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const paymentsData = await paymentsRes.json();
        const walletData = await walletRes.json();

        if (!paymentsRes.ok) {
          throw new Error(paymentsData?.message || "Unable to load payments.");
        }
        if (!walletRes.ok) {
          throw new Error(
            walletData?.message || "Unable to load wallet balance."
          );
        }

        const list = Array.isArray(paymentsData?.payments)
          ? paymentsData.payments
          : Array.isArray(paymentsData)
            ? paymentsData
            : [];

        if (isMounted) {
          setPayments(list);
          setWalletBalance(walletData?.wallet?.balance ?? 0);
        }
      } catch (error) {
        if (isMounted)
          setLoadError(error?.message || "Unable to load payments.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (token) {
      loadPayments();
    } else {
      setLoadError("Missing auth token.");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const totals = useMemo(() => {
    const codCollected = payments.reduce(
      (sum, item) => sum + Number(item?.codAmount || 0),
      0
    );
    const deliveryFees = payments.reduce(
      (sum, item) => sum + Number(item?.deliveryCharges || 0),
      0
    );
    return { codCollected, deliveryFees };
  }, [payments]);

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const statusClass = (status) => {
    const normalized = String(status || "").toLowerCase();
    if (normalized.includes("pending")) {
      return "bg-amber-50 text-amber-700";
    }
    if (normalized.includes("paid") || normalized.includes("completed")) {
      return "bg-green-50 text-green-700";
    }
    if (normalized.includes("failed") || normalized.includes("cancel")) {
      return "bg-red-50 text-red-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-light">
      <Topbar />

      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">Payments</h1>

        {/* COD Wallet Summary */}
        <div className="bg-white shadow rounded-xl p-5 mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                COD Wallet
              </p>
              <h2 className="text-lg font-semibold text-primary">
                Collected cash you can withdraw or reuse
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-blue-50"
                onClick={() => setShowTopUp((v) => !v)}
              >
                {showTopUp ? "Hide Add Balance" : "Add Balance"}
              </button>
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => setShowWithdraw((v) => !v)}
              >
                {showWithdraw ? "Hide Withdraw" : "Withdraw to Bank"}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Total COD Amount", value: totals.codCollected },
              { label: "Total Delivery Charges", value: totals.deliveryFees },
              {
                label: "Available Balance",
                value: walletBalance,
                accent: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-gray-100 rounded-xl p-4 bg-gray-50"
              >
                <p className="text-xs text-gray-500">{item.label}</p>
                <p
                  className={`text-2xl font-bold ${
                    item.accent ? "text-primary" : "text-gray-800"
                  }`}
                >
                  {formatCurrency(item.value)}
                </p>
              </div>
            ))}
          </div>

          {showTopUp && (
            <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  Amount to add
                  <input
                    type="number"
                    min="0"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="e.g. 2000"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <div className="flex flex-col justify-center text-sm text-gray-700">
                  <span className="font-medium">Pay using card / online</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Secure checkout, posts immediately.
                  </p>
                </div>
                <div className="flex items-end">
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-1">
                    Add Balance
                  </button>
                </div>
              </div>
            </div>
          )}

          {showWithdraw && (
            <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  Send to account
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {bankAccounts.map((acct) => (
                      <option key={acct.id} value={acct.id}>
                        {acct.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  Amount
                  <input
                    type="number"
                    min="0"
                    max={walletBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={`Max ${walletBalance}`}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </label>
                <div className="flex items-end gap-2">
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-1">
                    Confirm Withdrawal
                  </button>
                  <span className="text-xs text-gray-500">
                    Est. net after fees:{" "}
                    {formatCurrency(
                      Math.max(Number(withdrawAmount || 0) * 0.98, 0)
                    )}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Tip: You can also apply this balance directly to new shipments
                instead of withdrawing to a bank.
              </p>
            </div>
          )}
        </div>

        {/* Recent COD Collections */}
        <div className="bg-white shadow rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                COD Collections
              </p>
              <h2 className="text-lg font-semibold text-primary">
                Cash received from delivered shipments
              </h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700">
              {payments.length} records
            </span>
          </div>
          {isLoading ? (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="loading loading-spinner loading-sm" />
              Loading payments...
            </div>
          ) : loadError ? (
            <p className="text-sm text-red-600">{loadError}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-500 bg-gray-50">
                  <tr>
                    <th className="p-3">Collection</th>
                    <th className="p-3">Shipment</th>
                    <th className="p-3">COD</th>
                    <th className="p-3">Delivery Fee</th>
                    <th className="p-3">Amount to Collect</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map((row) => (
                    <tr
                      key={row._id || row.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-semibold text-primary">
                        {row._id || row.id}
                      </td>
                      <td className="p-3">{row.shipmentId || "-"}</td>
                      <td className="p-3">{formatCurrency(row.codAmount)}</td>
                      <td className="p-3">
                        {formatCurrency(row.deliveryCharges)}
                      </td>
                      <td className="p-3 font-semibold text-gray-800">
                        {formatCurrency(row.amount)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs ${statusClass(
                            row.status
                          )}`}
                        >
                          {row.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">
                        {formatDate(row.transactionDate || row.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
