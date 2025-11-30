import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { useState } from "react";

export default function Profile() {
  const [image, setImage] = useState(null);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1">
        <Topbar />

        <div className="p-4 sm:p-6 md:p-8">
          {/* Title */}
          <h1 className="text-2xl font-bold text-primary mb-6">
            Profile Settings
          </h1>

          {/* Profile Card */}
          <div className="bg-white shadow rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <img
                src={
                  image
                    ? URL.createObjectURL(image)
                    : "https://randomuser.me/api/portraits/men/32.jpg"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border shadow"
              />

              <label className="mt-4 bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                Change Photo
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            </div>

            {/* Basic Info */}
            <div className="flex-1 w-full">
              <h2 className="text-xl font-semibold text-primary mb-4">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-700 font-medium">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Arslan Naz"
                    className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium">Email</label>
                  <input
                    type="email"
                    defaultValue="arslan@example.com"
                    className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    defaultValue="+92 300 1234567"
                    className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-gray-700 font-medium">City</label>
                  <input
                    type="text"
                    defaultValue="Islamabad"
                    className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button className="mt-6 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Save Changes
              </button>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white shadow rounded-xl p-8 mt-10">
            <h2 className="text-xl font-bold text-primary mb-4">
              Change Password
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-700 font-medium">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:border-primary"
                />
              </div>
            </div>

            <button className="mt-6 bg-secondary text-black px-8 py-3 rounded-lg font-semibold hover:opacity-80 transition">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
