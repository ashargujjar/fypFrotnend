import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

export default function AdminProfile() {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />

        <div className="p-8">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Admin Profile
          </h1>

          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/37.jpg"
                className="w-20 h-20 rounded-full border"
              />
              <div>
                <h2 className="text-xl font-bold">Admin User</h2>
                <p className="text-gray-600">admin@example.com</p>
              </div>
            </div>

            <div>
              <label className="font-semibold">Phone</label>
              <input
                defaultValue="+92 300 1234567"
                className="w-full px-4 py-3 border rounded-lg outline-none mt-2"
              />
            </div>

            <div>
              <label className="font-semibold">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border rounded-lg outline-none mt-2"
              />
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
