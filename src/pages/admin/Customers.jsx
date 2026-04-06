import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminTopbar from "./components/AdminTopbar";
import { toastError, toastSuccess } from "../../utils/toast";

const API_URL = import.meta.env.VITE_API_URL;

const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString()}`;

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
};

const formatStatus = (value) => {
  if (!value) return "N/A";
  return String(value);
};

export default function Customers() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login?role=admin");
      return;
    }

    let isMounted = true;

    const loadCustomers = async () => {
      try {
        setLoadError("");
        setIsLoading(true);
        const endpoint = API_URL
          ? `${API_URL}/admin/customers`
          : "/admin/customers";
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load customers.");
        }
        const list = Array.isArray(data?.customers)
          ? data.customers
          : Array.isArray(data)
            ? data
            : [];
        if (isMounted) setCustomers(list);
      } catch (error) {
        if (isMounted)
          setLoadError(error?.message || "Unable to load customers.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCustomers();
    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((customer) => {
      const id = String(customer?.id || customer?._id || "").toLowerCase();
      const name = String(customer?.name || "").toLowerCase();
      const email = String(customer?.email || "").toLowerCase();
      const phone = String(customer?.phone || "").toLowerCase();
      return (
        id.includes(term) ||
        name.includes(term) ||
        email.includes(term) ||
        phone.includes(term)
      );
    });
  }, [customers, searchTerm]);

  const totalCustomers = customers.length;
  const totalBalance = customers.reduce(
    (sum, customer) => sum + Number(customer?.walletBalance || 0),
    0,
  );

  const handleRemove = async (customer) => {
    if (!token) {
      toastError("Missing admin token.");
      return;
    }
    if (!customer?.id) return;
    if (removingId === customer.id) return;

    const confirm = window.confirm(
      `Remove ${customer.name || "this customer"}? This will delete their shipments, payments, and alerts.`,
    );
    if (!confirm) return;

    setRemovingId(customer.id);
    try {
      const endpoint = API_URL
        ? `${API_URL}/admin/customers/${customer.id}`
        : `/admin/customers/${customer.id}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Unable to remove customer.");
      }
      setCustomers((prev) =>
        prev.filter((item) => String(item.id) !== String(customer.id)),
      );
      toastSuccess(data?.message || "Customer removed.");
    } catch (error) {
      toastError(error?.message || "Unable to remove customer.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewLatest = (customer) => {
    const shipmentId = customer?.lastShipment?.id;
    if (shipmentId) {
      navigate(`/admin/shipments/${shipmentId}`);
    }
  };

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Customer Management
            </h1>
            <p className="text-gray-600 text-sm">
              Review balances, deliveries, and payment statuses for customers.
            </p>
          </div>
        </div>

        <div className="customer-card bg-white p-6 rounded-xl shadow space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="customer-card customer-card-soft rounded-xl p-4">
              <p className="text-xs text-gray-500">Total Customers</p>
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <p className="text-2xl font-bold text-primary">
                  {totalCustomers}
                </p>
              )}
            </div>
            <div className="customer-card customer-card-soft rounded-xl p-4">
              <p className="text-xs text-gray-500">Total Wallet Balance</p>
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(totalBalance)}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="customer-input px-4 py-3 rounded-lg bg-white border outline-none focus:border-primary w-full md:max-w-md"
            />
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="loading loading-spinner loading-sm" />
                Loading customers...
              </div>
            ) : loadError ? (
              <p className="text-sm text-red-600">{loadError}</p>
            ) : filteredCustomers.length ? (
              <table className="w-full text-sm min-w-[960px]">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Customer</th>
                    <th className="py-2">Wallet</th>
                    <th className="py-2">Shipments</th>
                    <th className="py-2">Delivery Details</th>
                    <th className="py-2">Payments</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => {
                    const stats = customer?.shipmentStats || {};
                    const lastShipment = customer?.lastShipment;
                    const payments = customer?.paymentStats || {};
                    return (
                      <tr key={customer.id} className="border-b">
                        <td className="py-3">
                          <p className="font-semibold text-primary">
                            {customer.name || "Customer"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {customer.email || "No email"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {customer.phone || "No phone"}
                          </p>
                          <p className="text-xs text-gray-400">
                            ID: {customer.id}
                          </p>
                        </td>
                        <td className="py-3">
                          <p className="font-semibold">
                            {formatCurrency(customer.walletBalance)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Verified:{" "}
                            {customer.isEmailVerified ? "Yes" : "No"}
                          </p>
                        </td>
                        <td className="py-3 text-xs text-gray-600">
                          <p>Active: {stats.active || 0}</p>
                          <p>Delivered: {stats.delivered || 0}</p>
                          <p>Total: {stats.total || 0}</p>
                        </td>
                        <td className="py-3 text-xs text-gray-600">
                          {lastShipment ? (
                            <>
                              <p className="font-semibold text-slate-900">
                                {lastShipment.pickupCity || "Pickup"} ->{" "}
                                {lastShipment.deliveryCity || "Delivery"}
                              </p>
                              <p>
                                {lastShipment.pickupZone || "-"} to{" "}
                                {lastShipment.deliveryZone || "-"}
                              </p>
                              <p className="text-gray-500">
                                {formatStatus(lastShipment.status)}
                              </p>
                              <p className="text-gray-400">
                                Updated {formatDateTime(lastShipment.updatedAt)}
                              </p>
                            </>
                          ) : (
                            <p>No shipments yet.</p>
                          )}
                        </td>
                        <td className="py-3 text-xs text-gray-600">
                          <p>
                            Last Status:{" "}
                            {payments.lastStatus
                              ? formatStatus(payments.lastStatus)
                              : "N/A"}
                          </p>
                          <p>
                            Last Paid: {formatDateTime(payments.lastAt)}
                          </p>
                          <p>Paid: {payments.paid || 0}</p>
                          <p>Pending: {payments.pending || 0}</p>
                          <p>Total: {payments.total || 0}</p>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewLatest(customer)}
                              className="text-primary font-semibold disabled:text-gray-400"
                              disabled={!customer?.lastShipment?.id}
                            >
                              View Latest
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemove(customer)}
                              className="text-red-600 font-semibold"
                              disabled={removingId === customer.id}
                            >
                              {removingId === customer.id ? (
                                <span className="flex items-center gap-2">
                                  <span className="loading loading-spinner loading-xs" />
                                  Removing...
                                </span>
                              ) : (
                                "Remove"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500">No customers found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
