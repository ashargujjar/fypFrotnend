export const RIDERS = [
  { id: "R-001", name: "Ali Raza", zone: "Central" },
  { id: "R-002", name: "Fatima Khan", zone: "North" },
  { id: "R-003", name: "Umar Farooq", zone: "South" },
  { id: "R-004", name: "Sara Imran", zone: "Central" },
];

export const ASSIGNMENT_STAGES = ["pickup", "linehaul", "delivery"];

const STAGE_LABELS = {
  pickup: "Pickup",
  linehaul: "Linehaul",
  delivery: "Delivery",
};

const STAGE_RIDER_FIELDS = {
  pickup: ["pickupRider", "pickup_rider", "pickupRiderName"],
  linehaul: ["linehaulRider", "linehaul_rider", "intercityRider", "hubRider"],
  delivery: ["deliveryRider", "delivery_rider", "dropoffRider"],
};

const STAGE_STATUS_RULES = {
  pickup: {
    eligible: ["pending", "pickup", "on the way"],
    assigned: [
      "pickup rider assigned",
      "pickup assigned",
      "pickup in progress",
      "on the way",
      "arrived at pickup",
      "pickup completed",
    ],
  },
  linehaul: {
    eligible: [
      "dropped at warehouse",
      "droped at warehouse",
      "dropped at origin hub",
      "linehaul",
      "hub transfer",
      "on route",
    ],
    assigned: [
      "linehaul rider assigned",
      "linehaul assigned",
      "linehaul in progress",
      "on route",
    ],
  },
  delivery: {
    eligible: [
      "dropped at warehouse",
      "droped at warehouse",
      "delivery",
      "out for delivery",
      "collecting pin",
      "pin verified",
      "delivered",
    ],
    intercityEligible: [
      "destination hub",
      "arrived at destination",
      "reached destination hub",
      "arrived at destination hub",
      "delivery",
      "out for delivery",
      "collecting pin",
      "pin verified",
      "delivered",
    ],
    assigned: [
      "delivery rider assigned",
      "delivery assigned",
      "out for delivery",
      "collecting pin",
      "pin verified",
      "delivered",
    ],
  },
};

export const formatId = (value) => {
  const id = String(value || "").trim();
  if (!id) return "-";
  if (id.length <= 10) return id;
  return `${id.slice(0, 6)}...${id.slice(-4)}`;
};

const normalize = (value) => String(value || "").trim();
const normalizeStatus = (value) => normalize(value).toLowerCase();
const statusMatches = (status, tokens) =>
  tokens.some((token) => status.includes(token));

export const getStageLabel = (stage) => STAGE_LABELS[stage] || "Assignment";

export const getRiderForStage = (shipment, stage) => {
  if (!shipment || !stage) return "";
  const fields = STAGE_RIDER_FIELDS[stage] || [];
  for (const field of fields) {
    const value = normalize(shipment?.[field]);
    if (value) return value;
  }
  if (stage === "pickup") {
    const legacy = normalize(shipment?.rider);
    if (legacy) return legacy;
  }
  return "";
};

const resolveStageField = (shipment, stage) => {
  const fields = STAGE_RIDER_FIELDS[stage] || [];
  const existing = fields.find((field) =>
    Object.prototype.hasOwnProperty.call(shipment || {}, field),
  );
  return existing || fields[0] || "rider";
};

export const setRiderForStage = (shipment, stage, rider) => {
  const field = resolveStageField(shipment, stage);
  return { ...shipment, [field]: rider };
};

export const isAssigned = (shipment, stage) => {
  if (stage) {
    if (getRiderForStage(shipment, stage)) return true;
    const status = normalizeStatus(shipment?.status);
    const assignedTokens = STAGE_STATUS_RULES[stage]?.assigned || [];
    if (status && assignedTokens.length) {
      return statusMatches(status, assignedTokens);
    }
    return false;
  }
  if (ASSIGNMENT_STAGES.some((key) => getRiderForStage(shipment, key))) {
    return true;
  }
  if (normalize(shipment?.rider)) return true;
  if (normalizeStatus(shipment?.riderStatus) === "assigned") return true;
  return String(shipment?.status || "").toLowerCase() === "assigned";
};

export const formatArea = (city, zone) => {
  const parts = [city, zone].map(normalize).filter(Boolean);
  return parts.length ? parts.join(" - ") : "-";
};

export const isIntercity = (shipment) => {
  const pickupCity = normalize(shipment?.pickupCity);
  const dropoffCity = normalize(shipment?.deliveryCity);
  if (!pickupCity || !dropoffCity) return false;
  return pickupCity.toLowerCase() !== dropoffCity.toLowerCase();
};

export const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export const buildRouteLabel = (shipment) =>
  `${formatArea(shipment?.pickupCity, shipment?.pickupZone)} -> ${formatArea(
    shipment?.deliveryCity,
    shipment?.deliveryZone,
  )}`;

export const getAssignedRiders = (shipment) => ({
  pickup: getRiderForStage(shipment, "pickup"),
  linehaul: getRiderForStage(shipment, "linehaul"),
  delivery: getRiderForStage(shipment, "delivery"),
});

export const isStageApplicable = (shipment, stage) => {
  if (!stage) return true;
  if (stage === "linehaul") return isIntercity(shipment);
  return true;
};

export const isStageEligible = (shipment, stage) => {
  if (!stage) return true;
  if (!isStageApplicable(shipment, stage)) return false;
  const status = normalizeStatus(shipment?.status);
  if (!status) return stage === "pickup";
  const rules = STAGE_STATUS_RULES[stage];
  if (!rules) return true;
  const tokens =
    isIntercity(shipment) && rules.intercityEligible
      ? rules.intercityEligible
      : rules.eligible;
  if (!tokens?.length) return true;
  return statusMatches(status, tokens);
};
