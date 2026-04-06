import Topbar from "./components/Topbar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SenderInfo from "./components/book-shipment/SenderInfo";
import ReceiverInfo from "./components/book-shipment/ReceiverInfo";
import PackageDetails from "./components/book-shipment/PackageDetails";
import PaymentMethod from "./components/book-shipment/PaymentMethod";
import SubmitSection from "./components/book-shipment/SubmitSection";
import { toastError, toastSuccess } from "../../utils/toast";
const API_URL = import.meta.env.VITE_API_URL;
const MAPBOX_TOKEN = import.meta.env.VITE_MAP_BOX_TOKEN;
const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString()}`;
const inputClass =
  "customer-input p-3 border rounded-lg outline-none focus:border-primary border-gray-300";

const geocodeAddress = async (query) => {
  if (!MAPBOX_TOKEN) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query,
  )}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=PK`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Unable to reach geocoding service.");
  }
  const data = await res.json();
  if (!Array.isArray(data?.features) || data.features.length === 0) {
    throw new Error(`No location found for "${query}".`);
  }
  const [lng, lat] = data.features[0].center || [];
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error(`No location found for "${query}".`);
  }
  return { lat, lng };
};

export default function BookShipment() {
  const navigate = useNavigate();
  const [codAmount, setCodAmount] = useState(0);
  const [useWallet, setUseWallet] = useState(true);
  const [errors, setErrors] = useState({});
  const [cityZones, setCityZones] = useState({});
  const [zonesError, setZonesError] = useState("");
  const [walletBal, setWalletBal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isChargeLoading, setIsChargeLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    pickupCity: "",
    pickupZone: "",
    pickupAddress: "",
    receiverName: "",
    receiverPhone: "",
    deliveryCity: "",
    deliveryZone: "",
    deliveryAddress: "",
    weight: "",
    minTemp: "",
    maxTemp: "",
    packageType: "",
    notes: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadZones = async () => {
      try {
        setZonesError("");
        const endpoint = API_URL ? `${API_URL}/user/zones` : "/user/zones";
        const response = await fetch(endpoint);
        const w = await fetch(`${API_URL}/user/walletBalance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const wallet = await w.json();
        if (w.ok) {
          setWalletBal(wallet.wallet.balance);
        }

        if (!response.ok) {
          throw new Error("Failed to load zones");
        }
        const data = await response.json();
        const zonesList = Array.isArray(data?.zones) ? data.zones : [];
        const nextZones = zonesList.reduce((acc, item) => {
          if (item?.active && item?.city && Array.isArray(item?.zones)) {
            acc[item.city] = item.zones;
          }
          return acc;
        }, {});

        if (isMounted) setCityZones(nextZones);
      } catch (error) {
        if (isMounted) setZonesError("Unable to load city zones.");
      }
    };

    loadZones();
    return () => {
      isMounted = false;
    };
  }, []);

  const cityOptions = useMemo(() => Object.keys(cityZones).sort(), [cityZones]);

  useEffect(() => {
    const shouldCalculate =
      form.pickupCity && form.deliveryCity && Number(form.weight) > 0;
    if (!shouldCalculate) {
      setDeliveryCharge(0);
      return;
    }

    const controller = new AbortController();
    const loadCharge = async () => {
      try {
        setIsChargeLoading(true);
        const endpoint = API_URL
          ? `${API_URL}/shipment/calculateCharges`
          : "/shipment/calculateCharges";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pickupCity: form.pickupCity,
            deliveryCity: form.deliveryCity,
            weight: form.weight,
          }),
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok) {
          const nextCharge =
            data?.charge ??
            data?.deliveryCharges ??
            data?.deliveryCharge ??
            data?.data?.charge ??
            data?.data?.deliveryCharge ??
            data?.data?.deliveryCharges;
          setDeliveryCharge(Number(nextCharge) || 0);
        } else {
          setDeliveryCharge(0);
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          setDeliveryCharge(0);
        }
      } finally {
        setIsChargeLoading(false);
      }
    };

    loadCharge();
    return () => controller.abort();
  }, [form.pickupCity, form.deliveryCity, form.weight, token]);

  const hasWalletBalance = useMemo(
    () => Number(walletBal) >= Number(deliveryCharge),
    [walletBal, deliveryCharge]
  );

  useEffect(() => {
    if (useWallet && !hasWalletBalance) {
      setUseWallet(false);
    }
  }, [hasWalletBalance, useWallet]);

  const codToCollect = useMemo(() => {
    const cod = Number(codAmount) || 0;
    const fee = Number(deliveryCharge) || 0;
    return useWallet && hasWalletBalance ? cod : cod + fee;
  }, [codAmount, deliveryCharge, hasWalletBalance, useWallet]);

  const netToWallet = useMemo(() => {
    const cod = Number(codAmount) || 0;
    const fee = Number(deliveryCharge) || 0;
    return useWallet && hasWalletBalance ? cod : Math.max(cod - fee, 0);
  }, [codAmount, deliveryCharge, hasWalletBalance, useWallet]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    const parseOptionalNumber = (value) => {
      if (value === "" || value === null || value === undefined) return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    };
    const requiredFields = [
      "pickupCity",
      "pickupZone",
      "pickupAddress",
      "receiverName",
      "receiverPhone",
      "deliveryCity",
      "deliveryZone",
      "deliveryAddress",
      "weight",
      "packageType",
    ];

    requiredFields.forEach((field) => {
      if (!form[field]) nextErrors[field] = "Required";
    });

    const minTempValue = parseOptionalNumber(form.minTemp);
    const maxTempValue = parseOptionalNumber(form.maxTemp);

    if (form.minTemp !== "" && minTempValue === undefined) {
      nextErrors.minTemp = "Invalid";
    }
    if (form.maxTemp !== "" && maxTempValue === undefined) {
      nextErrors.maxTemp = "Invalid";
    }
    if (
      minTempValue !== undefined &&
      maxTempValue !== undefined &&
      minTempValue > maxTempValue
    ) {
      nextErrors.minTemp = "Min exceeds max";
      nextErrors.maxTemp = "Max below min";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { minTemp, maxTemp, ...restForm } = form;
    const pickupAddressFull = [
      form.pickupAddress,
      form.pickupZone,
      form.pickupCity,
      "Pakistan",
    ]
      .filter(Boolean)
      .join(", ");
    const deliveryAddressFull = [
      form.deliveryAddress,
      form.deliveryZone,
      form.deliveryCity,
      "Pakistan",
    ]
      .filter(Boolean)
      .join(", ");
    const submitData = {
      ...restForm,
      codAmount: codAmount,
      useWallet: useWallet,
      delieveryCharges: deliveryCharge,
    };
    if (minTempValue !== undefined) submitData.minTemp = minTempValue;
    if (maxTempValue !== undefined) submitData.maxTemp = maxTempValue;

    try {
      if (MAPBOX_TOKEN) {
        const [pickupCoords, deliveryCoords] = await Promise.all([
          geocodeAddress(pickupAddressFull),
          geocodeAddress(deliveryAddressFull),
        ]);
        if (!pickupCoords || !deliveryCoords) {
          throw new Error(
            "Unable to locate pickup or delivery address. Please make it more specific.",
          );
        }
        submitData.pickupLat = pickupCoords.lat;
        submitData.pickupLng = pickupCoords.lng;
        submitData.deliveryLat = deliveryCoords.lat;
        submitData.deliveryLng = deliveryCoords.lng;
      }

      const res = await fetch(`${API_URL}/shipment/bookShipment`, {
        body: JSON.stringify(submitData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      });
      const resp = await res.json();
      if (res.ok && resp?.success) {
        toastSuccess(resp?.message ?? "Shipment booked successfully.");
        navigate("/customer/dashboard");
      } else {
        toastError(resp?.message ?? "Unable to book shipment.");
      }
    } catch (error) {
      toastError("Unable to book shipment.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-light customer-page">
      <Topbar />

      <div className="customer-shell customer-stack p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Book a New Shipment
        </h1>

        <form
          className="customer-card customer-card-soft customer-stack bg-white shadow rounded-xl p-8 space-y-10"
          onSubmit={handleSubmit}
        >
          <SenderInfo
            cityOptions={cityOptions}
            cityZones={cityZones}
            errors={errors}
            form={form}
            handleChange={handleChange}
            inputClass={inputClass}
            setForm={setForm}
            zonesError={zonesError}
          />
          <ReceiverInfo
            cityOptions={cityOptions}
            cityZones={cityZones}
            errors={errors}
            form={form}
            handleChange={handleChange}
            inputClass={inputClass}
            setForm={setForm}
          />
          <PackageDetails
            errors={errors}
            form={form}
            handleChange={handleChange}
            inputClass={inputClass}
          />
          <PaymentMethod
            codAmount={codAmount}
            codToCollect={codToCollect}
            deliveryCharge={deliveryCharge}
            errors={errors}
            formatCurrency={formatCurrency}
            hasWalletBalance={hasWalletBalance}
            isChargeLoading={isChargeLoading}
            inputClass={inputClass}
            netToWallet={netToWallet}
            setCodAmount={setCodAmount}
            setUseWallet={setUseWallet}
            useWallet={useWallet}
          />
          <SubmitSection isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
}
const paymentType = "COD";
