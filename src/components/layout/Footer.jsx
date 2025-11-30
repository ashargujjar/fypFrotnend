import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl font-bold">
            <Link to={"/"}>ShipSmart</Link>{" "}
          </h2>
          <p className="text-gray-300 mt-2">
            Smart logistics visibility & traceability platform.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link to={"/"}>Home </Link>
            </li>

            <li>Track Shipment</li>
            <li>
              <Link to={"/login"}>Login </Link>
            </li>
            <li>Dashboard</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Contact</h3>
          <p className="text-gray-300">support@shipsmart.com</p>
          <p className="text-gray-300">+92 300 1234567</p>
        </div>
      </div>

      <p className="text-center text-gray-400 mt-8">
        © 2025 ShipSmart. All rights reserved.
      </p>
    </footer>
  );
}
