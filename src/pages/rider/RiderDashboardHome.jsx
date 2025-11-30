import RiderSidebar from "./components/RiderSidebar";
import RiderTopbar from "./components/RiderTopbar";

export default function RiderDashboardHome() {
  const tasks = [
    {
      id: "SS-1012",
      pickup: "Lahore Warehouse",
      dropoff: "Islamabad F-10",
      status: "Assigned",
      cod: "350",
    },
    {
      id: "SS-1090",
      pickup: "Rawalpindi I-9 Hub",
      dropoff: "Gulberg Greens",
      status: "Out for Delivery",
      cod: "0",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      <RiderSidebar />

      <div className="flex-1">
        <RiderTopbar />

        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Today's Tasks
          </h1>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="bg-white shadow rounded-xl p-6 space-y-3"
              >
                <h3 className="text-xl font-bold text-primary">
                  Shipment {t.id}
                </h3>

                <p>
                  <strong>Pickup:</strong> {t.pickup}
                </p>
                <p>
                  <strong>Dropoff:</strong> {t.dropoff}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-yellow-700 font-semibold">
                    {t.status}
                  </span>
                </p>

                <p>
                  <strong>COD Amount:</strong> Rs. {t.cod}
                </p>

                <button
                  onClick={() =>
                    (window.location.href = `/rider/navigation?shipment=${t.id}`)
                  }
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Start Delivery
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
