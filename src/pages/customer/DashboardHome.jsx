import Topbar from "./components/Topbar";
import StatsCard from "./components/StatsCard";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function DashboardHome() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login?role=customer");
    }
  }, [navigate, token]);

  useEffect(() => {
    let isMounted = true;

    const loadShipments = async () => {
      try {
        setLoadError("");
        const res = await fetch(`${API_URL}/shipment/getShipments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Unable to load shipments.");
        }
        const list = Array.isArray(data?.shipments)
          ? data.shipments
          : Array.isArray(data)
            ? data
            : [];
        if (isMounted) setShipments(list);
      } catch (error) {
        if (isMounted)
          setLoadError(error?.message || "Unable to load shipments.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (token) {
      loadShipments();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const normalizeStatus = (status) => String(status || "").toLowerCase().trim();
  const deliveredCount = shipments.filter(
    (shipment) => normalizeStatus(shipment.status) === "delivered"
  ).length;
  const activeCount = Math.max(shipments.length - deliveredCount, 0);
  const activeValue = isLoading ? "..." : String(activeCount);
  const deliveredValue = isLoading ? "..." : String(deliveredCount);

  return (
    <div className="min-h-screen bg-light">
      {/* Top Bar */}
      <Topbar />

      {/* CONTENT */}
      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard title="Active Shipments" value={activeValue} icon="AS" />
          <StatsCard title="Delivered" value={deliveredValue} icon="DL" />
          <StatsCard title="Alerts" value="1" icon="AL" />
          <StatsCard title="Payments" value="5" icon="PM" />
        </div>

          {/* Quick Actions */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-primary mb-4">
              Quick Actions
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/customer/shipments"
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 transition group-hover:scale-110" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-semibold">
                  MS
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  My Shipments
                </p>
                <p className="text-sm text-slate-500">
                  Review shipment history and statuses.
                </p>
              </Link>

              <Link
                to="/customer/book"
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-200/40 transition group-hover:scale-110" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white font-semibold">
                  BS
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  Book Shipment
                </p>
                <p className="text-sm text-slate-500">
                  Create a new shipment request.
                </p>
              </Link>

              <Link
                to="/customer/track"
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/40 transition group-hover:scale-110" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white font-semibold">
                  TS
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  Track Shipment
                </p>
                <p className="text-sm text-slate-500">
                  Follow live updates by ID.
                </p>
              </Link>

              <Link
                to="/customer/payments"
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-200/40 transition group-hover:scale-110" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-white font-semibold">
                  PM
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  Payments
                </p>
                <p className="text-sm text-slate-500">
                  View invoices and payment status.
                </p>
              </Link>

              <Link
                to="/customer/complaints"
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-200/40 transition group-hover:scale-110" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500 text-white font-semibold">
                  CP
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  Complaints
                </p>
                <p className="text-sm text-slate-500">
                  Report issues and track tickets.
                </p>
              </Link>
            </div>
          </div>

        {/* Live Shipments Table */}
        <div className="mt-10 bg-white shadow rounded-xl p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-primary">Live Shipments</h3>
            <button
              type="button"
              onClick={() => navigate("/customer/shipments")}
              className="text-sm font-semibold text-primary hover:underline self-start"
            >
              View more shipments
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[560px]">
              <thead>
                <tr className="bg-light text-gray-600">
                  <th className="p-3">ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">ETA</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="p-3">
                    <Link
                      to="/customer/track/SS-1012"
                      className="font-semibold text-primary hover:underline"
                    >
                      SS-1012
                    </Link>
                  </td>
                  <td className="p-3 text-yellow-600 font-semibold">
                    In Transit
                  </td>
                  <td className="p-3">Rawalpindi</td>
                  <td className="p-3">2 hrs</td>
                </tr>

                <tr className="border-b">
                  <td className="p-3">
                    <Link
                      to="/customer/track/SS-1090"
                      className="font-semibold text-primary hover:underline"
                    >
                      SS-1090
                    </Link>
                  </td>
                  <td className="p-3 text-green-600 font-semibold">
                    Delivered
                  </td>
                  <td className="p-3">Islamabad</td>
                  <td className="p-3">Delivered</td>
                </tr>

                <tr>
                  <td className="p-3">
                    <Link
                      to="/customer/track/SS-1121"
                      className="font-semibold text-primary hover:underline"
                    >
                      SS-1121
                    </Link>
                  </td>
                  <td className="p-3 text-red-600 font-semibold">
                    Temperature Alert
                  </td>
                  <td className="p-3">Lahore</td>
                  <td className="p-3">Unknown</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
