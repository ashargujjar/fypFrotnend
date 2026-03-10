import { useEffect, useMemo, useState } from "react";
import AdminTopbar from "./components/AdminTopbar";
const API_URL = import.meta.env.VITE_API_URL;
export default function Shipments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [shipments, setShipments] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const getShipments = async () => {
      try {
        const res = await fetch(`${API_URL}/shipment/getAllShipments`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resp = await res.json();
        if (!res.ok) {
          throw new Error(resp.message);
        }
        if (resp.shipments.length > 0) {
          setShipments(resp.shipments);
          console.log(resp.shipments);
        } else {
          throw new Error(resp.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getShipments();
  }, []);

  const getRiderDetails = (shipment) => {
    const task =
      Array.isArray(shipment?.riderTasks) && shipment.riderTasks.length > 0
        ? shipment.riderTasks[0]
        : null;
    const rider = task?.rider || shipment?.rider || null;
    const name =
      typeof rider === "string" ? rider : rider?.name || "";
    const status =
      shipment?.riderStatus || task?.status || "";
    const city =
      typeof rider === "object" ? rider?.assignedCity : "";
    const zone =
      typeof rider === "object" ? rider?.assignedZone : "";
    const phone =
      typeof rider === "object" ? rider?.phone : "";

    return { name, status, city, zone, phone };
  };

  const filteredAndSortedShipments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = shipments.filter((s) => {
      const id = String(s?._id || s?.id || "").toLowerCase();
      return id.includes(term);
    });

    if (!sortField) return filtered;

    const resolveSortValue = (item) => {
      if (sortField === "origin") return item?.pickupCity || "";
      if (sortField === "dest") return item?.deliveryCity || "";
      if (sortField === "rider") {
        const rider = getRiderDetails(item);
        return rider.name || rider.status || "";
      }
      return item?.[sortField] || "";
    };

    return [...filtered].sort((a, b) =>
      String(resolveSortValue(a)).localeCompare(String(resolveSortValue(b))),
    );
  }, [shipments, searchTerm, sortField]);

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Manage Shipments
        </h1>

        <div className="customer-card bg-white p-6 shadow rounded-xl overflow-x-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by Shipment ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">None</option>
                <option value="origin">Origin</option>
                <option value="status">Status</option>
                <option value="dest">Destination</option>
                <option value="rider">Rider</option>
              </select>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600">
                <th className="p-3">ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Origin</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Rider</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedShipments.map((s) => (
                <tr
                  key={s._id || s.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{s._id || s.id}</td>
                  <td className="p-3">{s.status}</td>
                  <td className="p-3">{s.pickupCity}</td>
                  <td className="p-3">{s.deliveryCity}</td>
                  <td className="p-3">
                    {(() => {
                      const riderInfo = getRiderDetails(s);
                      if (!riderInfo.name && !riderInfo.status) {
                        return (
                          <p className="text-sm text-gray-500">
                            Unassigned
                          </p>
                        );
                      }
                      return (
                        <div className="space-y-1">
                          <p className="font-semibold text-primary">
                            {riderInfo.name || "Unknown Rider"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Status: {riderInfo.status || "Unassigned"}
                          </p>
                          {(riderInfo.city || riderInfo.zone || riderInfo.phone) ? (
                            <div className="text-xs text-gray-500">
                              {riderInfo.city ? <p>{riderInfo.city}</p> : null}
                              {riderInfo.zone ? <p>{riderInfo.zone}</p> : null}
                              {riderInfo.phone ? <p>{riderInfo.phone}</p> : null}
                            </div>
                          ) : null}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        const shipmentId = s._id || s.id;
                        if (shipmentId) {
                          window.location.href = `/admin/shipments/${shipmentId}`;
                        }
                      }}
                      className="customer-button text-primary font-semibold hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
