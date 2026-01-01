import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { toastSuccess, toastError } from "../../utils/toast";
const API_URL = import.meta.env.VITE_API_URL;
export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const role = (searchParams.get("role") || "customer").toLowerCase();
  const roleConfig = {
    admin: { title: "Admin Login", redirect: "/admin/dashboard" },
    rider: { title: "Rider Login", redirect: "/rider/dashboard" },
    customer: { title: "Customer Login", redirect: "/customer/dashboard" },
  };
  const { title, redirect } = roleConfig[role] || roleConfig.customer;

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: role,
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setLoading(false);
      const result = await res.json();
      localStorage.setItem("token", result.token);
      toastSuccess("Login successfull");
      navigate(redirect);
    } else {
      const result = await res.json();
      setLoading(false);
      toastError(result.message);
    }
  };

  const handleForgotPassword = () => {
    const currentLoginPath = `${location.pathname}${location.search}`;
    navigate("/forgot-password", {
      state: { returnTo: currentLoginPath, role },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
        <p className="text-gray-500 mb-6">
          Enter your credentials to continue.
        </p>

        <input
          type="email"
          placeholder="Email"
          name="email"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:border-primary"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:border-primary"
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {!loading ? (
            <p>Login</p>
          ) : (
            <span className="loading loading-spinner loading-lg"></span>
          )}
        </button>

        <p className="text-center text-sm text-primary font-medium mt-3 cursor-pointer">
          <span onClick={handleForgotPassword}>Forgot password?</span>
        </p>
      </div>
    </div>
  );
}
