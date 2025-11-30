import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
// adjust the path based on your actual structure:
import { shipments } from "../customer/data/shipments";

export default function PublicTrack() {
  const navigate = useNavigate();
  const params = useParams();
  const urlId = params.id; // for /track/:id route

  const [trackingId, setTrackingId] = useState(urlId || "");

  const shipment =
    (trackingId && shipments.find((s) => s.id === trackingId)) || null;

  const handleTrack = () => {
    if (!trackingId.trim()) return;
    // Update URL for shareable link
    navigate(`/track/${trackingId.trim()}`);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[70vh] bg-light flex flex-col items-center px-4 py-12">
        {/* Header */}
        <div className="max-w-3xl w-full text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary">
            Track Your Shipment
          </h1>
          <p className="text-gray-600 mt-2">
            Enter your tracking ID to see the live status of your parcel.
          </p>
        </div>

        {/* Track Box */}
        <div className="max-w-xl w-full bg-white shadow-md rounded-2xl p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. SS-1012"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border outline-none focus:border-primary"
            />
            <button
              onClick={handleTrack}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Track
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            You can find the tracking ID on the SMS / email sent by the shipper.
          </p>
        </div>

        {/* RESULT SECTION */}
        <div className="max-w-5xl w-full">
          {!trackingId ? (
            <p className="text-center text-gray-500">
              Enter a tracking ID above to view shipment details.
            </p>
          ) : !shipment ? (
            <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
              No shipment found for ID{" "}
              <span className="font-semibold text-primary">{trackingId}</span>.
              Please check the ID and try again.
            </div>
          ) : (
            <>
              {/* Overview Card */}
              <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h2 className="text-xl font-bold text-primary mb-2">
                  Shipment Overview
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Tracking ID</p>
                    <p className="font-bold text-dark">{shipment.id}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Status</p>
                    <p className="font-bold text-yellow-700">
                      {shipment.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Estimated Delivery</p>
                    <p className="font-bold text-dark">{shipment.eta}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">From</p>
                    <p className="font-bold text-dark">{shipment.origin}</p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">To</p>
                    <p className="font-bold text-dark">
                      {shipment.destination}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Last Update</p>
                    <p className="font-bold text-dark">
                      {
                        shipment.timeline[shipment.timeline.length - 1]
                          ?.timestamp
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Map */}
              <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Live Location
                </h2>

                <div className="relative w-full h-[350px] bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-500">
                  {/* Mapbox will be integrated here */}
                  Mapbox Map (Public View)
                  {/* Temperature bubble (read-only) */}
                  {shipment.temperature && (
                    <div className="absolute top-4 left-4 bg-white shadow-lg px-4 py-2 rounded-xl border">
                      <p className="text-gray-600 text-xs">Temp</p>
                      <p className="text-xl font-bold text-red-600">
                        {shipment.temperature.current}°
                        {shipment.temperature.unit}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h2 className="text-xl font-bold text-primary mb-4">
                  Shipment Timeline
                </h2>

                <ul className="space-y-3">
                  {shipment.timeline.map((ev) => (
                    <li
                      key={`${shipment.id}-${ev.timestamp}`}
                      className="border-l-4 border-primary pl-4"
                    >
                      <p className="font-semibold">{ev.label}</p>
                      <p className="text-gray-500 text-sm">{ev.timestamp}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Public Alerts (safe subset) */}
              {shipment.alerts && shipment.alerts.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow">
                  <h2 className="text-xl font-bold text-primary mb-4">
                    Important Notices
                  </h2>
                  <ul className="space-y-2">
                    {shipment.alerts.map((a) => (
                      <li
                        key={`${shipment.id}-alert-${a}`}
                        className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
