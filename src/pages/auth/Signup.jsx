import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toastSuccess, toastError } from "../../utils/toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });
  const [isLoading, setLoading] = useState(false);
  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setLoading(false);

      const result = await res.json();
      toastError(result?.message ?? "Something went wrong");
      return;
    }
    if (res.ok) {
      setLoading(false);
      navigate("/login?role=customer");
      toastSuccess("Login successful");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Customer Signup
        </h1>
        <p className="text-gray-500 mb-6">Create your customer account.</p>

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
          type="tel"
          name="phone"
          placeholder="Phone Number"
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
          {isLoading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            "Create Account"
          )}
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
