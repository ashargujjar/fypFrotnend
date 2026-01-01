export default function ReceiverInfo({
  cityOptions,
  cityZones,
  errors,
  form,
  handleChange,
  inputClass,
  setForm,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">
        Receiver Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Receiver Name"
          value={form.receiverName}
          onChange={(e) => handleChange("receiverName", e.target.value)}
          className={`${inputClass} ${
            errors.receiverName ? "border-red-400" : ""
          }`}
        />
        <input
          type="text"
          placeholder="Receiver Phone"
          value={form.receiverPhone}
          onChange={(e) => handleChange("receiverPhone", e.target.value)}
          className={`${inputClass} ${
            errors.receiverPhone ? "border-red-400" : ""
          }`}
        />
        <select
          value={form.deliveryCity}
          onChange={(e) => {
            handleChange("deliveryCity", e.target.value);
            setForm((prev) => ({ ...prev, deliveryZone: "" }));
          }}
          className={`${inputClass} ${
            errors.deliveryCity ? "border-red-400" : ""
          }`}
        >
          <option value="">Select Delivery City</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          value={form.deliveryZone}
          onChange={(e) => handleChange("deliveryZone", e.target.value)}
          className={`${inputClass} ${
            errors.deliveryZone ? "border-red-400" : ""
          }`}
          disabled={!form.deliveryCity}
        >
          <option value="">
            {form.deliveryCity
              ? "Select Delivery Zone / Area"
              : "Select Delivery City first"}
          </option>
          {(cityZones[form.deliveryCity] || []).map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Delivery Address"
          value={form.deliveryAddress}
          onChange={(e) => handleChange("deliveryAddress", e.target.value)}
          className={`md:col-span-2 ${inputClass} ${
            errors.deliveryAddress ? "border-red-400" : ""
          }`}
        />
      </div>
    </div>
  );
}
