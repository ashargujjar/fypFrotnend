import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";
import { useState } from "react";

export default function AddRider() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    assignedCity: "",
    riderCategory: "",
    assignedZone: "",
  });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    alert("Rider Created (Mock). Link this to backend later.");
    console.log(form);
  };

  // Pre-defined city → zone list (you can add more later)
  const zones = {
    Islamabad: [
      "Jinnah Garden Zone",
      "G-10 North Zone",
      "Bahria Town Zone",
      "DHA Phase 2 Zone",
      "Blue Area Central Zone",
    ],
    Lahore: [
      "Johar Town Zone",
      "Gulberg Zone",
      "Shahdara Zone",
      "Model Town Zone",
    ],
    Karachi: [
      "Clifton Zone",
      "Gulshan Zone",
      "Saddar Zone",
      "North Nazimabad Zone",
    ],
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-light min-h-screen">
        <AdminTopbar />

        <div className="p-8 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-6">
            Add New Rider
          </h1>

          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            {/* Rider Name */}
            <input
              type="text"
              name="name"
              placeholder="Rider Name"
              className="w-full px-4 py-3 border rounded-lg"
              onChange={update}
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full px-4 py-3 border rounded-lg"
              onChange={update}
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg"
              onChange={update}
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg"
              onChange={update}
            />

            {/* Assigned City */}
            <select
              name="assignedCity"
              className="w-full px-4 py-3 border rounded-lg"
              value={form.assignedCity}
              onChange={update}
            >
              <option value="">Select City</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
            </select>

            {/* Rider Category */}
            <select
              name="riderCategory"
              className="w-full px-4 py-3 border rounded-lg"
              value={form.riderCategory}
              onChange={update}
            >
              <option value="">Select Rider Category</option>
              <option value="pickup">Pickup Rider</option>
              <option value="linehaul">Intercity Linehaul Rider</option>
              <option value="delivery">Delivery Rider</option>
            </select>

            {/* Assigned Zone (ONLY for pickup and delivery) */}
            {form.riderCategory !== "linehaul" && form.assignedCity && (
              <select
                name="assignedZone"
                className="w-full px-4 py-3 border rounded-lg"
                value={form.assignedZone}
                onChange={update}
              >
                <option value="">Select Zone</option>
                {zones[form.assignedCity]?.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            )}

            {/* Submit Button */}
            <button
              onClick={handleCreate}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Rider Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
