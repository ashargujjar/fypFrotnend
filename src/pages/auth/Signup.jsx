import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
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
          type="text"
          name="address"
          placeholder="Street Address"
          className="w-full mb-4 px-4 py-3 border rounded-lg"
          onChange={update}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            className="w-full px-4 py-3 border rounded-lg"
            onChange={update}
          />
          <input
            type="text"
            name="state"
            placeholder="State/Province"
            className="w-full px-4 py-3 border rounded-lg"
            onChange={update}
          />
        </div>

        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          className="w-full mb-4 mt-4 px-4 py-3 border rounded-lg"
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
