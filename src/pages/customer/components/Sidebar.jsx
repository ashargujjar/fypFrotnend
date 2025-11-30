import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-full md:w-64 bg-primary text-white md:min-h-screen p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 md:mb-10">ShipSmart</h1>

      <ul className="space-y-3 md:space-y-4 font-medium">
        <li>
          <Link className="hover:text-secondary" to="/customer/dashboard">
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/customer/shipments">
            My Shipments
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/customer/book-shipment">
            Book Shipment
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/customer/track">
            Track Shipment
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/customer/payments">
            Payments
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/customer/complaints">
            Complaints
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/customer/profile">
            Profile
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/login">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}
