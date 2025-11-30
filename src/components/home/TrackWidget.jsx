export default function TrackWidget() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-primary">Track Your Shipment</h2>
        <p className="text-gray-600 mt-2">
          Enter your shipment ID and get live sensor data instantly.
        </p>

        {/* Small sleek box */}
        <div className="mt-6 flex items-center bg-light px-3 py-2 rounded-full shadow-lg">
          <input
            type="text"
            placeholder="Shipment ID..."
            className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-600"
          />

          <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-blue-700 transition">
            Track
          </button>
        </div>
      </div>
    </section>
  );
}
