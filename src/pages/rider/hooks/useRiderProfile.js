import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const readCachedProfile = () => {
  try {
    const cached = localStorage.getItem("riderProfile");
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

export default function useRiderProfile() {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(() => readCachedProfile());
  const [loading, setLoading] = useState(!profile);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Missing auth token.");
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      try {
        setError("");
        setLoading(!profile);
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
        const rider = data?.rider || null;
        if (isMounted) {
          setProfile(rider);
          localStorage.setItem("riderProfile", JSON.stringify(rider));
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Unable to load rider profile.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return { profile, loading, error };
}
