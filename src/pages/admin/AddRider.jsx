import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";
import { useState } from "react";

export default function AddRider() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    city: "",
  });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    alert("Rider Created (Mock). Link this to backend later.");
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
            <input
              type="text"
              name="name"
              placeholder="Rider Name"
              className="w-full px-4 py-3 border rounded-lg"
              onChange={update}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full px-4 py-3 border rounded-lg"
              onChange={update}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg"
              onChange={update}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg"
              onChange={update}
            />

            <input
              type="text"
              name="city"
              placeholder="City / Zone"
              className="w-full px-4 py-3 border rounded-lg"
              onChange={update}
            />

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
