import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import { toastSuccess, toastError } from "../../utils/toast";
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
    <div className="min-h-screen flex items-center justify-center bg-light p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2">New Password</h1>
        <p className="text-gray-500 mb-6">
          Create a new password {email ? `for ${email}` : "for your account"}.
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:border-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:border-primary"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <button
          onClick={handleReset}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {!loading ? (
            <p> Update Password</p>
          ) : (
            <span className="loading loading-spinner loading-lg"></span>
          )}
        </button>

        <p
          className="text-center text-sm text-primary font-medium mt-3 cursor-pointer"
          onClick={() => navigate(returnTo)}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}
