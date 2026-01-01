import Topbar from "./components/Topbar";
import { useState } from "react";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString()}`;

export default function Payments() {
  const wallet = {
    codCollected: 8550,
    deliveryFees: 1150,
    available: 7400,
    recent: [
      {
        id: "CC-501",
        shipmentId: "SS-2210",
        collected: 2200,
        fee: 200,
        net: 2000,
        status: "Pending withdrawal",
        date: "2025-01-21",
      },
      {
        id: "CC-498",
        shipmentId: "SS-2204",
        collected: 1800,
        fee: 180,
        net: 1620,
        status: "Applied to shipment",
        date: "2025-01-19",
      },
      {
        id: "CC-492",
        shipmentId: "SS-2195",
        collected: 2600,
        fee: 250,
        net: 2350,
        status: "Withdrawn",
        date: "2025-01-17",
      },
    ],
    bankAccounts: [
      { id: "acct-1", label: "UBL **** 2023" },
      { id: "acct-2", label: "Meezan **** 1190" },
    ],
  };

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(
    wallet.bankAccounts[0]?.id || ""
  );
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

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
                { label: "COD Collected", value: wallet.codCollected },
                { label: "Delivery Charges", value: wallet.deliveryFees },
                { label: "Available Balance", value: wallet.available, accent: true },
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
                      {wallet.bankAccounts.map((acct) => (
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
                      max={wallet.available}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder={`Max ${wallet.available}`}
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
                  Tip: You can also apply this balance directly to new shipments instead of
                  withdrawing to a bank.
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
                {wallet.recent.length} records
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-500 bg-gray-50">
                  <tr>
                    <th className="p-3">Collection</th>
                    <th className="p-3">Shipment</th>
                    <th className="p-3">Collected</th>
                    <th className="p-3">Delivery Fee</th>
                    <th className="p-3">Net to Wallet</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {wallet.recent.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-semibold text-primary">{row.id}</td>
                      <td className="p-3">{row.shipmentId}</td>
                      <td className="p-3">{formatCurrency(row.collected)}</td>
                      <td className="p-3">{formatCurrency(row.fee)}</td>
                      <td className="p-3 font-semibold text-gray-800">
                        {formatCurrency(row.net)}
                      </td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-lg text-xs bg-amber-50 text-amber-700">
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

      </div>
    </div>
  );
}
