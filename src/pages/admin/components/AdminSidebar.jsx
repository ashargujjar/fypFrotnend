import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const navItems = [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Shipments", to: "/admin/shipments" },
    { label: "Customers", to: "/admin/customers" },
    { label: "Riders", to: "/admin/riders" },
    { label: "Assignments", to: "/admin/assignments" },
    { label: "IoT Center", to: "/admin/iot" },
    { label: "Manage Cities", to: "/admin/cities" },
    { label: "Delivery Rates", to: "/admin/rates" },
    { label: "Profile", to: "/admin/profile" },
    { label: "Logout", to: "/login" },
  ];
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside className="w-full lg:w-64 bg-primary text-white lg:min-h-screen p-6 flex-shrink-0 border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <ul className="mt-8 space-y-2 font-medium">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <li key={item.to}>
              <Link
                className={`block rounded-lg px-3 py-2 transition ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                to={item.to}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
