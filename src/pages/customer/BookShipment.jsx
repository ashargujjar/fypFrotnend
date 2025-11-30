import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { useState } from "react";

export default function BookShipment() {
  const [paymentType, setPaymentType] = useState("COD");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Area */}
      <div className="flex-1">
        <Topbar />

        <div className="p-4 sm:p-6 md:p-8">
          {/* TITLE */}
          <h1 className="text-2xl font-bold text-primary mb-6">
            Book a New Shipment
          </h1>

          <div className="bg-white shadow rounded-xl p-8 space-y-10">
            {/* SENDER INFO */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Sender Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Sender Name"
                  className="p-3 border rounded-lg outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Sender Phone"
                  className="p-3 border rounded-lg outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Pickup Address"
                  className="md:col-span-2 p-3 border rounded-lg outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* RECEIVER INFO */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Receiver Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Receiver Name"
                  className="p-3 border rounded-lg outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Receiver Phone"
                  className="p-3 border rounded-lg outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Delivery Address"
                  className="md:col-span-2 p-3 border rounded-lg outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* PACKAGE INFO */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Package Details
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  className="p-3 border rounded-lg outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Package Type (Electronics, Food, etc)"
                  className="md:col-span-2 p-3 border rounded-lg outline-none focus:border-primary"
                />
              </div>

              <textarea
                placeholder="Additional Notes (Optional)"
                className="w-full mt-4 p-3 border rounded-lg outline-none focus:border-primary"
                rows="3"
              ></textarea>
            </div>

            {/* PAYMENT METHOD */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Payment Method
              </h2>

              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentType === "COD"}
                    onChange={() => setPaymentType("COD")}
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentType === "Prepaid"}
                    onChange={() => setPaymentType("Prepaid")}
                  />
                  <span>Prepaid (Online Payment)</span>
                </label>
              </div>

              {/* PRICE ESTIMATE */}
              <div className="mt-6 bg-light p-4 rounded-lg border">
                <p className="text-gray-600">Estimated Delivery Charges</p>
                <h3 className="text-3xl font-bold text-primary mt-2">
                  Rs. 350
                </h3>
                <p className="text-xs text-gray-500">
                  * Auto-calculated based on distance & weight
                </p>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">
              Confirm Shipment Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
