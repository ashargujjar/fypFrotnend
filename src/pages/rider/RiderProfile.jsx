import RiderSidebar from "./components/RiderSidebar";
import RiderTopbar from "./components/RiderTopbar";

export default function RiderProfile() {
  return (
    <div className="flex">
      <RiderSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <RiderTopbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Rider Profile
          </h1>

          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/44.jpg"
                className="w-20 h-20 rounded-full border"
              />
              <div>
                <h2 className="text-xl font-bold">Rider John</h2>
                <p className="text-gray-600">john.rider@example.com</p>
              </div>
            </div>

            <div>
              <label className="font-semibold">Phone</label>
              <input
                className="w-full px-4 py-3 border rounded-lg outline-none mt-2"
                defaultValue="+92 300 1234567"
              />
            </div>

            <div>
              <label className="font-semibold">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border rounded-lg outline-none mt-2"
              />
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
