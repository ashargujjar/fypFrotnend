import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const role = query.get("role") || "partner";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "partner") navigate("/customer/dashboard");
    else if (role === "rider") navigate("/rider/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {role.charAt(0).toUpperCase() + role.slice(1)} Login
        </h1>
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

        {role === "partner" && (
          <p className="text-gray-600 text-sm mt-4 text-center">
            New Partner?{" "}
            <span
              className="text-primary font-semibold cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Signup
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
