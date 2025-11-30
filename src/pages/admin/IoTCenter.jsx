import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function IoTCenter() {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            IoT Sensor Center
          </h1>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center">
              IoT Sensor Graph Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
