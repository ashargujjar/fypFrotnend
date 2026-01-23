import { useEffect, useRef, useState } from "react";
import AdminTopbar from "./components/AdminTopbar";
import AssignedShipments from "./components/assignments/AssignedShipments";
import AssignmentQueue from "./components/assignments/AssignmentQueue";
import AssignmentsHeader from "./components/assignments/AssignmentsHeader";
import OverviewSection from "./components/assignments/OverviewSection";
import { toastError, toastSuccess } from "../../utils/toast";
import {
  getStageLabel,
  isAssigned,
  isIntercity,
  isStageEligible,
  setRiderForStage,
} from "./components/assignments/assignmentUtils";
const API_URL = import.meta.env.VITE_API_URL;

const normalizeCategory = (value) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("linehaul")) return "linehaul";
  if (normalized.includes("pickup")) return "pickup";
  if (normalized.includes("delivery")) return "delivery";
  return normalized;
};

const normalizeRiders = (list) =>
  list.map((item, index) => ({
    id: item?._id || item?.riderId || `R-${String(index + 1).padStart(3, "0")}`,
    name: item?.name || item?.fullName || item?.username || "Unknown",
    city: item?.assignedCity || item?.city || "-",
    zone: item?.assignedZone || item?.zone || "",
    category: normalizeCategory(
      item?.riderCategory || item?.category || item?.type || "",
    ),
  }));

export default function Assignments() {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [riders, setRiders] = useState([]);
  useEffect(() => {
    let isMounted = true;

    const fetchShipments = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const response = await fetch(`${API_URL}/admin/allShipments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log("Fetched shipments:", data.shipments || data);
        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch shipments.");
        }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.shipments)
            ? data.shipments
            : Array.isArray(data?.data)
              ? data.data
              : [];
        if (isMounted) setShipments(list);
      } catch (error) {
        if (isMounted)
          setLoadError(error?.message || "Failed to fetch shipments.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    const fetchRiders = async () => {
      try {
        const response = await fetch(`${API_URL}/rider/getRiders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log("Fetched riders:", data.riders || data);
        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch riders.");
        }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.riders)
            ? data.riders
            : Array.isArray(data?.data)
              ? data.data
              : [];
        if (isMounted) setRiders(normalizeRiders(list));
      } catch (error) {
        if (isMounted)
          setLoadError(error?.message || "Failed to fetch riders.");
      }
    };
    fetchRiders();

    fetchShipments();
    return () => {
      isMounted = false;
    };
  }, []);

  const [selectedRiders, setSelectedRiders] = useState({});
  const [assignmentStage, setAssignmentStage] = useState("pickup");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [sortBy, setSortBy] = useState("assigned-first");
  const assignedSectionRef = useRef(null);
  const [assigningMap, setAssigningMap] = useState({});

  const stageLabel = getStageLabel(assignmentStage);
  const stageShipments = shipments.filter((shipment) =>
    isStageEligible(shipment, assignmentStage),
  );
  const unassignedCount = stageShipments.filter(
    (shipment) => !isAssigned(shipment, assignmentStage),
  ).length;
  const assignedCount = stageShipments.filter((shipment) =>
    isAssigned(shipment, assignmentStage),
  ).length;
  const intercityCount = shipments.filter((shipment) =>
    isIntercity(shipment),
  ).length;
  const intracityCount = shipments.length - intercityCount;

  const filteredShipments = shipments.filter((shipment) => {
    if (!isStageEligible(shipment, assignmentStage)) return false;
    const assigned = isAssigned(shipment, assignmentStage);
    if (assignmentFilter === "all" && assigned) return false;
    if (assignmentFilter === "assigned" && !assigned) return false;
    if (assignmentFilter === "unassigned" && assigned) return false;
    if (routeFilter === "intracity" && isIntercity(shipment)) return false;
    if (routeFilter === "intercity" && !isIntercity(shipment)) return false;
    return true;
  });

  const sortedShipments = filteredShipments.slice().sort((a, b) => {
    if (sortBy === "assigned-first") {
      return (
        Number(isAssigned(b, assignmentStage)) -
        Number(isAssigned(a, assignmentStage))
      );
    }
    if (sortBy === "unassigned-first") {
      return (
        Number(isAssigned(a, assignmentStage)) -
        Number(isAssigned(b, assignmentStage))
      );
    }
    if (sortBy === "order") {
      return String(a?._id || "").localeCompare(String(b?._id || ""));
    }
    return 0;
  });

  const assignedShipments = shipments.filter(
    (shipment) =>
      isStageEligible(shipment, assignmentStage) &&
      isAssigned(shipment, assignmentStage),
  );

  const handleSelectRider = (shipmentId, stage, riderName) => {
    setSelectedRiders((prev) => ({
      ...prev,
      [shipmentId]: {
        ...(prev[shipmentId] || {}),
        [stage]: riderName,
      },
    }));
  };

  const handleAssign = async (shipmentId, stage) => {
    const riderName = selectedRiders[shipmentId]?.[stage];
    if (!riderName) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toastError("Missing admin token.");
      return;
    }
    const assignKey = `${shipmentId}:${stage}`;
    if (assigningMap[assignKey]) return;
    setAssigningMap((prev) => ({ ...prev, [assignKey]: true }));

    try {
      const endpoint = API_URL
        ? `${API_URL}/admin/assignRider`
        : "/admin/assignRider";
      const rider = riders.find((item) => item?.name === riderName);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipmentId,
          riderId: rider?.id,
        }),
      });
      const data = await response.json().catch(() => ({}));
      console.log(data);
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || data.error);
      }

      toastSuccess(data?.message || "Rider assigned.");
      setShipments((prev) =>
        prev.map((shipment) => {
          if (shipment._id !== shipmentId) return shipment;
          const updated = setRiderForStage(shipment, stage, riderName);
          return { ...updated, status: "assigned" };
        }),
      );

      setSelectedRiders((prev) => {
        const next = { ...prev };
        const entry = { ...(next[shipmentId] || {}) };
        delete entry[stage];
        if (Object.keys(entry).length) {
          next[shipmentId] = entry;
        } else {
          delete next[shipmentId];
        }
        return next;
      });

      requestAnimationFrame(() => {
        assignedSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (error) {
      toastError(error?.message || "Unable to assign rider.");
    } finally {
      setAssigningMap((prev) => {
        const next = { ...prev };
        delete next[assignKey];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-light customer-page">
      <AdminTopbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <AssignmentsHeader
          isLoading={isLoading}
          unassignedCount={unassignedCount}
          assignmentStage={assignmentStage}
        />

        <OverviewSection
          isLoading={isLoading}
          unassignedCount={unassignedCount}
          intercityCount={intercityCount}
          intracityCount={intracityCount}
          stageLabel={stageLabel}
        />

        <AssignmentQueue
          assignmentStage={assignmentStage}
          assignmentFilter={assignmentFilter}
          routeFilter={routeFilter}
          sortBy={sortBy}
          stageLabel={stageLabel}
          onChangeAssignmentStage={setAssignmentStage}
          onChangeAssignmentFilter={setAssignmentFilter}
          onChangeRouteFilter={setRouteFilter}
          onChangeSortBy={setSortBy}
          shipments={sortedShipments}
          isLoading={isLoading}
          loadError={loadError}
          riders={riders}
          selectedRiders={selectedRiders}
          assigningMap={assigningMap}
          onSelectRider={handleSelectRider}
          onAssign={handleAssign}
        />

        <AssignedShipments
          sectionRef={assignedSectionRef}
          assignedCount={assignedCount}
          shipments={assignedShipments}
          isLoading={isLoading}
          loadError={loadError}
          assignmentStage={assignmentStage}
        />
      </div>
    </div>
  );
}
