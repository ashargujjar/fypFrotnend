import Topbar from "./components/Topbar";
import { useEffect, useState } from "react";
import { toastError, toastSuccess } from "../../utils/toast";
const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoadError("");
        const res = await fetch(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Unable to load profile.");
        }
        const nextProfile = data?.user || data?.profile || data;
        if (isMounted) {
          setProfile(nextProfile || null);
          setForm({
            fullName:
              nextProfile?.fullName ||
              nextProfile?.name ||
              nextProfile?.username ||
              "",
            email: nextProfile?.email || "",
            phone: nextProfile?.phone || nextProfile?.phoneNumber || "",
          });
        }
      } catch (error) {
        if (isMounted)
          setLoadError(error?.message || "Unable to load profile.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (token) {
      loadProfile();
    } else {
      setLoadError("Missing auth token.");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to update profile.");
      }
      toastSuccess(data?.message || "Profile updated.");
      setProfile((prev) => ({ ...prev, ...form }));
    } catch (error) {
      toastError(error?.message || "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Topbar />

      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Profile Settings
        </h1>

          {/* Profile Card */}
          <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10">
            {/* Basic Info */}
            <div className="w-full">
              <h2 className="text-xl font-semibold text-primary mb-4">
                Personal Information
              </h2>

              {isLoading ? (
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="loading loading-spinner loading-sm" />
                  Loading profile...
                </div>
              ) : loadError ? (
                <p className="text-sm text-red-600">{loadError}</p>
              ) : null}

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-700 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                className="mt-8 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSaving || isLoading}
                onClick={handleSave}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

      </div>
    </div>
  );
}
