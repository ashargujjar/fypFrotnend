export default function SenderInfo({
  cityOptions,
  cityZones,
  errors,
  form,
  handleChange,
  inputClass,
  setForm,
  zonesError,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">
        Sender Information
      </h2>

      {zonesError && <p className="text-sm text-red-500 mb-3">{zonesError}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <select
          value={form.pickupCity}
          onChange={(e) => {
            handleChange("pickupCity", e.target.value);
            setForm((prev) => ({ ...prev, pickupZone: "" }));
          }}
          className={`${inputClass} ${
            errors.pickupCity ? "border-red-400" : ""
          }`}
        >
          <option value="">Select Pickup City</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          value={form.pickupZone}
          onChange={(e) => handleChange("pickupZone", e.target.value)}
          className={`${inputClass} ${
            errors.pickupZone ? "border-red-400" : ""
          }`}
          disabled={!form.pickupCity}
        >
          <option value="">
            {form.pickupCity
              ? "Select Pickup Zone / Area"
              : "Select Pickup City first"}
          </option>
          {(cityZones[form.pickupCity] || []).map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Pickup Address"
          value={form.pickupAddress}
          onChange={(e) => handleChange("pickupAddress", e.target.value)}
          className={`md:col-span-2 ${inputClass} ${
            errors.pickupAddress ? "border-red-400" : ""
          }`}
        />
      </div>
    </div>
  );
}
