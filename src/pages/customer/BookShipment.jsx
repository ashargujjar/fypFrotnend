import Topbar from "./components/Topbar";
import { useEffect, useMemo, useState } from "react";
import SenderInfo from "./components/book-shipment/SenderInfo";
import ReceiverInfo from "./components/book-shipment/ReceiverInfo";
import PackageDetails from "./components/book-shipment/PackageDetails";
import PaymentMethod from "./components/book-shipment/PaymentMethod";
import SubmitSection from "./components/book-shipment/SubmitSection";
import { toastError, toastSuccess } from "../../utils/toast";
const API_URL = import.meta.env.VITE_API_URL;
const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString()}`;
const inputClass =
  "p-3 border rounded-lg outline-none focus:border-primary border-gray-300";

export default function BookShipment() {
  const [codAmount, setCodAmount] = useState(0);
  const [useWallet, setUseWallet] = useState(true);
  const [errors, setErrors] = useState({});
  const [cityZones, setCityZones] = useState({});
  const [zonesError, setZonesError] = useState("");
  const [walletBal, setWalletBal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const deliveryCharge = useMemo(() => {
    const weight = parseFloat(form.weight) || 0;
    const base = 250;
    const weightExtra = Math.max(weight - 1, 0) * 80;
    return Math.round(base + weightExtra);
  }, [form.weight]);

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

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    const submitData = {
      ...form,
      codAmount: codAmount,
      useWallet: useWallet,
      delieveryCharges: deliveryCharge,
    };

    try {
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
    <div className="min-h-screen bg-light">
      <Topbar />

      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">
          Book a New Shipment
        </h1>

        <form
          className="bg-white shadow rounded-xl p-8 space-y-10"
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
