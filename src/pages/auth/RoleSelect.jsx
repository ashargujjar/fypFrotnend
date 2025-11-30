import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Choose Your Role
        </h1>

        <p className="text-gray-600 mb-8">
          Select your login type to continue.
        </p>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate("/login?role=admin")}
            className="py-3 bg-primary text-white rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Admin Login
          </button>

          <button
            onClick={() => navigate("/login?role=partner")}
            className="py-3 bg-primary text-white rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Partner Login
          </button>

          <button
            onClick={() => navigate("/login?role=rider")}
            className="py-3 bg-primary text-white rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Rider Login
          </button>
        </div>

        <p className="text-gray-600 text-sm mt-6">
          New Partner?{" "}
          <span
            className="text-primary font-semibold cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup here
          </span>
        </p>
      </div>
    </div>
  );
}
