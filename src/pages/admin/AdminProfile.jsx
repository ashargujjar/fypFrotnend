import AdminTopbar from "./components/AdminTopbar";

export default function AdminProfile() {
  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Profile Settings
        </h1>

        <div className="customer-card customer-card-soft bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Personal Information
          </h2>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 font-medium">Full Name</label>
              <input
                defaultValue="Admin User"
                className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Email</label>
              <input
                type="email"
                defaultValue="admin@example.com"
                className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Phone Number</label>
              <input
                defaultValue="+92 300 1234567"
                className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <button className="customer-button mt-8 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
