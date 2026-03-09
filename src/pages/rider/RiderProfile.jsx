import RiderTopbar from "./components/RiderTopbar";

export default function RiderProfile() {
  return (
    <div className="min-h-screen bg-light customer-page">
      <RiderTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">Rider Profile</h1>

        <div className="customer-card bg-white p-6 rounded-xl shadow space-y-6">
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
            <label className="font-semibold">Full Name</label>
            <input
              className="customer-input w-full px-4 py-3 border rounded-lg outline-none mt-2"
              defaultValue="John Rider"
              disabled
            />
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              className="customer-input w-full px-4 py-3 border rounded-lg outline-none mt-2"
              defaultValue="john.rider@example.com"
            />
          </div>

          <div>
            <label className="font-semibold">Phone</label>
            <input
              className="customer-input w-full px-4 py-3 border rounded-lg outline-none mt-2"
              defaultValue="+92 300 1234567"
            />
          </div>

          <div>
            <label className="font-semibold">City</label>
            <input
              className="customer-input w-full px-4 py-3 border rounded-lg outline-none mt-2"
              defaultValue="Lahore"
              disabled
            />
          </div>

          <div>
            <label className="font-semibold">Old Password</label>
            <input
              type="password"
              className="customer-input w-full px-4 py-3 border rounded-lg outline-none mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">New Password</label>
            <input
              type="password"
              className="customer-input w-full px-4 py-3 border rounded-lg outline-none mt-2"
            />
          </div>

          <button className="customer-button w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
