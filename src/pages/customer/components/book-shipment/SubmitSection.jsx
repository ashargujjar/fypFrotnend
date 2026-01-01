export default function SubmitSection({ isSubmitting = false }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-gray-500">
        We'll show riders the COD amount and delivery notes. Charges marked
        "from wallet" will be netted off before settlement.
      </p>
      <button
        type="submit"
        className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="loading loading-spinner loading-sm" />
            Booking...
          </span>
        ) : (
          "Confirm Shipment Booking"
        )}
      </button>
    </div>
  );
}
