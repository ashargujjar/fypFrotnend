import { Link } from "react-router-dom";

export default function RiderSidebar() {
  return (
    <div className="w-full md:w-64 bg-primary text-white md:min-h-screen p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 md:mb-10">ShipSmart Rider</h1>

      <ul className="space-y-3 md:space-y-4 font-medium">
        <li>
          <Link className="hover:text-secondary" to="/rider/dashboard">
            Overview
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/rider/pickups">
            Pickup Tasks
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/rider/linehaul">
            Linehaul / Hub
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/rider/deliveries">
            Delivery Tasks
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/rider/alerts">
            Alerts
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/rider/profile">
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
