export default function PaymentMethod({
  codAmount,
  codToCollect,
  deliveryCharge,
  errors,
  formatCurrency,
  hasWalletBalance,
  inputClass,
  netToWallet,
  setCodAmount,
  setUseWallet,
  useWallet,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">Payment Method</h2>

      <div className="mt-6 space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between gap-4">
          <label className="flex-1 text-sm text-gray-700">
            Amount to collect from customer (COD)
            <input
              type="number"
              min="0"
              value={codAmount ?? 0}
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
            checked={useWallet && hasWalletBalance}
            disabled={!hasWalletBalance}
            onChange={(e) => setUseWallet(e.target.checked)}
          />
          {hasWalletBalance ? (
            "Use wallet balance to pay delivery charges (off = deduct from COD)"
          ) : (
            <p className="text-red-700 capitalize">
              you don't have enough balance in wallet, recharge to use it
            </p>
          )}
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="COD to collect"
            value={formatCurrency(codToCollect || 0)}
          />
          <SummaryCard
            label="Delivery charges"
            value={formatCurrency(deliveryCharge || 0)}
            hint={
              useWallet && hasWalletBalance
                ? "Paid from wallet"
                : "Added to COD collection"
            }
          />
          <SummaryCard
            label="Net to your wallet"
            value={formatCurrency(netToWallet)}
            accent
          />
        </div>
        <p className="text-xs text-gray-500">
          Riders collect COD plus delivery charges when wallet is off. Your
          wallet net is COD minus charges. When wallet is on, delivery charges
          are paid from wallet and COD stays the same.
        </p>
      </div>

      <div className="mt-6 bg-light p-4 rounded-lg border">
        <p className="text-sm text-gray-600">
          Toggle wallet to decide how you want to handle charges: ON = pay from
          wallet; OFF = deduct from COD amount.
        </p>
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
