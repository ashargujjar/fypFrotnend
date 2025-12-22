import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") || "customer").toLowerCase();
  const roleConfig = {
    admin: { title: "Admin Login", redirect: "/admin/dashboard" },
    rider: { title: "Rider Login", redirect: "/rider/dashboard" },
    partner: { title: "Customer Login", redirect: "/customer/dashboard" },
    customer: { title: "Customer Login", redirect: "/customer/dashboard" },
  };
  const { title, redirect } = roleConfig[role] || roleConfig.customer;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigate(redirect);
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
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:border-primary"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:border-primary"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

      </div>
    </div>
  );
}
