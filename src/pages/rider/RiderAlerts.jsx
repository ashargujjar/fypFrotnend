import RiderSidebar from "./components/RiderSidebar";
import RiderTopbar from "./components/RiderTopbar";

export default function RiderAlerts() {
  return (
    <div className="flex">
      <RiderSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <RiderTopbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">Alerts</h1>

          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Today, 9:30 AM</p>
              <p className="font-semibold text-dark">
                Pickup location changed for shipment SS-1012.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Yesterday, 5:12 PM</p>
              <p className="font-semibold text-dark">
                Heavy traffic reported near Islamabad F-10. Expect delays.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <p className="text-sm text-gray-500">This Week</p>
              <p className="font-semibold text-primary">
                Keep your app updated to receive live route optimizations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
