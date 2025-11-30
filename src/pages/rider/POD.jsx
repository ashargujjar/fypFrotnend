import { useLocation } from "react-router-dom";
import RiderSidebar from "./components/RiderSidebar";
import RiderTopbar from "./components/RiderTopbar";

export default function POD() {
  const query = new URLSearchParams(useLocation().search);
  const shipmentId = query.get("shipment") || "SS-0000";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      <RiderSidebar />

      <div className="flex-1">
        <RiderTopbar />

        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Proof of Delivery
          </h1>

          <div className="bg-white shadow p-6 rounded-xl space-y-6">
            <p className="text-sm text-gray-500">
              Shipment ID: <span className="font-semibold">{shipmentId}</span>
            </p>
            {/* Signature */}
            <div>
              <h3 className="font-semibold">Customer Signature</h3>
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                Signature Pad Here
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <h3 className="font-semibold">Delivery Photo</h3>
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                Upload Photo Area
              </div>
            </div>

            {/* COD */}
            <div>
              <label className="font-semibold">COD Collected</label>
              <input
                type="number"
                className="w-full px-4 py-3 border rounded-lg outline-none focus:border-primary mt-2"
                placeholder="Enter amount"
              />
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Submit POD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
