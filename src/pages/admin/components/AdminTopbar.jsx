import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const onDashboard = location.pathname === "/admin/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login?role=admin");
  };

  return (
    <div className="customer-topbar w-full bg-white shadow-md py-4 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-lg font-bold text-primary">ShipSmart</span>
        <span className="text-sm text-gray-500">Admin Dashboard</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!onDashboard && (
          <Link
            to="/admin/dashboard"
            className="customer-button px-3 py-1.5 text-sm font-semibold text-primary border border-primary/30 rounded-full hover:bg-primary hover:text-white transition"
          >
            Back to Dashboard
          </Link>
        )}
        <button
          type="button"
          onClick={() => navigate("/admin/profile")}
          className="customer-button px-3 py-1.5 text-sm font-semibold text-primary border border-primary/30 rounded-full hover:bg-primary hover:text-white transition"
        >
          Profile
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="customer-button px-3 py-1.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
