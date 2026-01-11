import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toastSuccess, toastError } from "../../utils/toast";
import AuthBackground from "../../components/auth/AuthBackground";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    key: "",
    role: "admin",
  });
  const [isLoading, setLoading] = useState(false);
  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.key.trim()) {
      toastError("Admin key is required");
      return;
    }
    setLoading(true);
    const res = await fetch(`${API_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setLoading(false);

      const result = await res.json();
      toastError(result?.message ?? "Something went wrong");
      return;
    }
    if (res.ok) {
      setLoading(false);
      navigate("/login?role=admin");
      toastSuccess(
        "Account created successful. Verify clicking the link on gmail"
      );
      toastSuccess("Login now!");
    }
  };

  return (
    <div className="min-h-screen relative isolate flex items-center justify-center overflow-hidden bg-light p-6">
      <AuthBackground />
      <div className="relative z-10 auth-card bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        <div className="auth-stack">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">
            Admin Signup
          </h1>
          <p className="text-gray-500 mb-6">Create your admin account.</p>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full mb-4 px-4 py-3 border rounded-lg transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-md"
            onChange={update}
          />

          <input
            type="email"
            name="email"
            placeholder="Business Email"
            className="w-full mb-4 px-4 py-3 border rounded-lg transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-md"
            onChange={update}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="w-full mb-4 px-4 py-3 border rounded-lg transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-md"
            onChange={update}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 border rounded-lg transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-md"
            onChange={update}
          />

          <input
            type="text"
            name="key"
            placeholder="Admin Key"
            className="w-full mb-4 px-4 py-3 border rounded-lg transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-md"
            onChange={update}
          />

          <button
            onClick={handleSignup}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-gray-600 text-sm mt-4 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login?role=admin")}
              className="text-primary font-semibold cursor-pointer transition hover:opacity-80"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
