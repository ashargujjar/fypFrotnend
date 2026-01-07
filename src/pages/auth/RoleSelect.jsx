import { useNavigate } from "react-router-dom";
import AuthBackground from "../../components/auth/AuthBackground";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative isolate flex items-center justify-center overflow-hidden bg-light p-6">
      <AuthBackground />
      <div className="relative z-10 auth-card bg-white shadow-xl rounded-xl p-10 w-full max-w-lg text-center">
        <div className="auth-stack">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-6">
            Choose Your Role
          </h1>

          <p className="text-gray-600 mb-8">
            Select your login type to continue.
          </p>

          <div className="grid grid-cols-1 gap-4 auth-stack">
            <button
              onClick={() => navigate("/login?role=admin")}
              className="py-3 bg-primary text-white rounded-lg text-lg transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              Admin Login
            </button>

            <button
              onClick={() => navigate("/login?role=customer")}
              className="py-3 bg-primary text-white rounded-lg text-lg transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              Customer Login
            </button>

            <button
              onClick={() => navigate("/login?role=rider")}
              className="py-3 bg-primary text-white rounded-lg text-lg transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              Rider Login
            </button>
          </div>

          <p className="text-gray-600 text-sm mt-6">
            New Partner?{" "}
            <span
              className="text-primary font-semibold cursor-pointer transition hover:opacity-80"
              onClick={() => navigate("/signup")}
            >
              Signup here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
