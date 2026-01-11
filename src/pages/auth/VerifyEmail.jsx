import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { toastSuccess, toastError } from "../../utils/toast";
import AuthBackground from "../../components/auth/AuthBackground";

const API_URL = import.meta.env.VITE_API_URL;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = (searchParams.get("token") || "").trim();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");

  const hasToken = token.length > 0;
  const statusText =
    feedback || (hasToken ? "" : "Missing verification token.");
  const statusClass = isError || !hasToken ? "text-red-600" : "text-green-600";

  const handleVerify = async () => {
    if (!hasToken) {
      const message = "Missing verification token.";
      setFeedback(message);
      setIsError(true);
      toastError(message);
      return;
    }

    setIsVerifying(true);
    setFeedback("");
    setIsError(false);
    try {
      const res = await fetch(
        `${API_URL}/user/verifyEmail?token=${encodeURIComponent(token)}`
      );
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = result?.message || "Verification failed.";
        setIsVerifying(false);
        setFeedback(message);
        setIsError(true);
        toastError(message);
        return;
      }
      const message = result?.message || "Email verified successfully.";
      setIsVerifying(false);
      setFeedback(message);
      setIsError(false);
      toastSuccess(message);
      navigate("/login?role=customer");
    } catch (error) {
      const message = "Unable to verify your email right now.";
      setIsVerifying(false);
      setFeedback(message);
      setIsError(true);
      toastError(message);
    }
  };

  const handleResend = async () => {
    const trimmedEmail = email.trim();
    if (!hasToken && !trimmedEmail) {
      const message = "Email is required to resend the token.";
      setFeedback(message);
      setIsError(true);
      toastError(message);
      return;
    }

    setIsResending(true);
    setFeedback("");
    setIsError(false);
    try {
      const endpoint = hasToken
        ? `${API_URL}/user/verifyEmail?token=${encodeURIComponent(token)}`
        : `${API_URL}/user/sendToken`;
      const requestOptions = hasToken
        ? { method: "GET" }
        : {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: trimmedEmail }),
          };
      const res = await fetch(endpoint, requestOptions);
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = result?.message || "Unable to resend the token.";
        setIsResending(false);
        setFeedback(message);
        setIsError(true);
        toastError(message);
        return;
      }
      const message = result?.message || "Verification email resent.";
      setIsResending(false);
      setFeedback(message);
      setIsError(false);
      toastSuccess(message);
    } catch (error) {
      const message = "Unable to resend the token right now.";
      setIsResending(false);
      setFeedback(message);
      setIsError(true);
      toastError(message);
    }
  };

  return (
    <div className="min-h-screen relative isolate flex items-center justify-center overflow-hidden bg-light p-6">
      <AuthBackground />
      <div className="relative z-10 auth-card bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        <div className="auth-stack">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">
            Verify Email
          </h1>
          <p className="text-gray-500 mb-6">
            Confirm your email to activate your customer account.
          </p>

          {statusText && (
            <p className={`text-sm mb-4 ${statusClass}`}>{statusText}</p>
          )}

          <button
            onClick={handleVerify}
            disabled={!hasToken || isVerifying || isResending}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold transition hover:bg-blue-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            {isVerifying ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              "Verify Now"
            )}
          </button>

          <input
            type="email"
            placeholder="Enter your email to resend token"
            className="w-full mt-4 px-4 py-3 border rounded-lg transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-md"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <button
            onClick={handleResend}
            disabled={isResending || isVerifying}
            className="mt-3 w-full py-3 border border-primary text-primary rounded-lg font-semibold transition hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            {isResending ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              "Resend Token"
            )}
          </button>

          <p
            className="text-center text-sm text-primary font-medium mt-4 cursor-pointer transition hover:opacity-80"
            onClick={() => navigate("/login?role=customer")}
          >
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
}
