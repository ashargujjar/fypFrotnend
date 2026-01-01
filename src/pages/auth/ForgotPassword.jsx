import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toastSuccess, toastError } from "../../utils/toast";
const API_URL = import.meta.env.VITE_API_URL;
export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [feedback, setFeedback] = useState("");
  const role = (
    location.state?.role ||
    searchParams.get("role") ||
    "customer"
  ).toLowerCase();
  const returnTo = location.state?.returnTo || "/login";

  const handleSendOtp = async () => {
    setLoading(true);
    if (!email.trim()) {
      setLoading(false);

      setFeedback("Provide your account email to receive an OTP.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/user/sendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      if (!res.ok) {
        setLoading(false);

        const result = await res.json().catch(() => ({}));
        const message = result?.message || "Unable to send OTP right now.";
        setFeedback(message);
        toastError(message);
        return;
      }
      const result = await res.json();
      setFeedback(`OTP sent to ${email}. Use the code we emailed you.`);
      setIsOtpSent(true);
      toastSuccess("OTP sent successfully.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const message = "Unable to send OTP right now.";
      setFeedback(message);
      toastError(message);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    if (!otp.trim()) {
      setLoading(false);

      setFeedback("Enter the OTP we shared with you.");
      return;
    }
    const res = await fetch(`${API_URL}/user/verifyOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.trim(), role, otp }),
    });
    const result = await res.json();
    localStorage.setItem("resetPasswordToken", result.resetToken);

    if (res.ok) {
      setLoading(false);

      toastSuccess("otp verfied");
      setFeedback("");
      navigate("/reset-password", {
        state: {
          email,
          returnTo,
          role,
        },
      });
    } else {
      toastError(result.message);
      setLoading(false);
    }
  };

  const handleAction = () => {
    if (isOtpSent) {
      handleVerifyOtp();
    } else {
      handleSendOtp();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-500 mb-6">
          Tell us the email linked to your account and we will send you a one
          time password to continue.
        </p>

        <input
          type="email"
          placeholder="Account Email"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:border-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {isOtpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:border-primary"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        {feedback && <p className="text-sm text-red-600 mb-4">{feedback}</p>}

        <button
          onClick={handleAction}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {isOtpSent ? (
            !loading ? (
              "Verify OTP"
            ) : (
              <span className="loading loading-spinner loading-lg"></span>
            )
          ) : !loading ? (
            "Send OTP"
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
