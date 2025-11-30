import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    password: "",
  });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = () => {
    navigate("/customer/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2">Partner Signup</h1>
        <p className="text-gray-500 mb-6">Create your business account.</p>

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          className="w-full mb-4 px-4 py-3 border rounded-lg"
          onChange={update}
        />

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full mb-4 px-4 py-3 border rounded-lg"
          onChange={update}
        />

        <input
          type="email"
          name="email"
          placeholder="Business Email"
          className="w-full mb-4 px-4 py-3 border rounded-lg"
          onChange={update}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 border rounded-lg"
          onChange={update}
        />

        <button
          onClick={handleSignup}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Create Account
        </button>

        <p className="text-gray-600 text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login?role=partner")}
            className="text-primary font-semibold cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
