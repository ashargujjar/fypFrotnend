import { Navigate } from "react-router-dom";
import useRiderProfile from "../hooks/useRiderProfile";

const normalize = (value) => String(value || "").toLowerCase();

export default function RiderAccess({ allow, children }) {
  const token = localStorage.getItem("token");
  const { profile, loading, error } = useRiderProfile();

  if (!token) {
    return <Navigate to="/login?role=rider" replace />;
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-light customer-page flex items-center justify-center text-sm text-gray-600">
        Loading rider access...
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-light customer-page flex items-center justify-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  const category = normalize(profile?.riderCategory);
  const allowedList = Array.isArray(allow)
    ? allow.map((item) => normalize(item))
    : [normalize(allow)];
  const isAllowed =
    !allow || allowedList.includes(category);

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-light customer-page flex items-center justify-center p-6">
        <div className="customer-card bg-white rounded-xl p-6 text-center max-w-md w-full">
          <h1 className="text-xl font-bold text-primary mb-2">
            Access Restricted
          </h1>
          <p className="text-sm text-gray-600">
            Your rider category does not have access to this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
