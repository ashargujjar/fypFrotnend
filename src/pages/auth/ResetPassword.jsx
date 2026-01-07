import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import { toastSuccess, toastError } from "../../utils/toast";
import AuthBackground from "../../components/auth/AuthBackground";
export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const returnTo = location.state?.returnTo || "/login";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetToken = localStorage.getItem("resetPasswordToken");
  if (!resetToken) {
    navigate("/login");
  }
  const handleReset = async () => {
    setLoading(true);

    if (!password.trim() || !confirmPassword.trim()) {
      setLoading(false);

      setError("Fill both password fields to continue.");
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords must match.");
      return;
    }
    const res = await fetch(`${API_URL}/user/resetPassword`, {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resetToken}`,
      },
    });

    const result = await res.json();
    if (res.ok) {
      setLoading(false);

      toastSuccess(result.message);
      navigate(returnTo);
    } else {
      toastError(result.message);
      setLoading(false);
      setError("");
    }
  };

  return (
    <div className="min-h-screen relative isolate flex items-center justify-center overflow-hidden bg-light p-6">
      <AuthBackground />
      <div className="relative z-10 auth-card bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        <div className="auth-stack">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">
            New Password
          </h1>
          <p className="text-gray-500 mb-6">
            Create a new password {email ? `for ${email}` : "for your account"}.
          </p>

          <input
            type="password"
            placeholder="New Password"
            className="w-full mb-4 px-4 py-3 border rounded-lg transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-4 px-4 py-3 border rounded-lg transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

          <button
            onClick={handleReset}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            {!loading ? (
              <p> Update Password</p>
            ) : (
              <span className="loading loading-spinner loading-lg"></span>
            )}
          </button>

          <p
            className="text-center text-sm text-primary font-medium mt-3 cursor-pointer transition hover:opacity-80"
            onClick={() => navigate(returnTo)}
          >
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
}
