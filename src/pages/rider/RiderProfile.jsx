import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RiderTopbar from "./components/RiderTopbar";
import { toastError } from "../../utils/toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function RiderProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const formatCategory = (value) => {
    const normalized = String(value || "").toLowerCase();
    if (!normalized) return "-";
    if (normalized === "linehaul") return "Linehaul Rider";
    if (normalized === "pickup") return "Pickup Rider";
    if (normalized === "delivery") return "Delivery Rider";
    return value;
  };

  useEffect(() => {
    if (!token) {
      navigate("/login?role=rider");
      return;
    }

    let isMounted = true;
    const loadProfile = async () => {
      try {
        setLoadError("");
        setIsLoading(true);
        const endpoint = API_URL ? `${API_URL}/rider/profile` : "/rider/profile";
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load rider profile.");
        }
        if (isMounted) setProfile(data?.rider || null);
      } catch (error) {
        const message = error?.message || "Unable to load rider profile.";
        if (isMounted) setLoadError(message);
        toastError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [navigate, token]);

  return (
    <div className="min-h-screen bg-light customer-page">
      <RiderTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">Rider Profile</h1>

        <div className="customer-card bg-white p-6 rounded-xl shadow space-y-6">
          <div>
            <h2 className="text-xl font-bold text-primary">
              Rider Information
            </h2>
            <p className="text-sm text-gray-500">
              Your profile details are view-only.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="loading loading-spinner loading-sm" />
              Loading profile...
            </div>
          ) : loadError ? (
            <p className="text-sm text-red-600">{loadError}</p>
          ) : profile ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Full Name
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {profile?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Email
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {profile?.email || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Phone
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {profile?.phone || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  City
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {profile?.assignedCity || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Rider Category
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {formatCategory(profile?.riderCategory)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Assigned Zone
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {profile?.assignedZone || "-"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No profile data available.
            </p>
          )}

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Note: To update any profile information, please contact the admin.
          </div>
        </div>
      </div>
    </div>
  );
}
