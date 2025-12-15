import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-primary text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>

      <ul className="space-y-4 font-medium">
        <li>
          <Link className="hover:text-secondary" to="/admin/dashboard">
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/admin/shipments">
            Shipments
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/admin/riders">
            Riders
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/admin/assignments">
            Assignments
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/admin/iot">
            IoT Center
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/admin/blockchain">
            Blockchain
          </Link>
        </li>
        <li>
          <Link className="hover:text-secondary" to="/admin/profile">
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
