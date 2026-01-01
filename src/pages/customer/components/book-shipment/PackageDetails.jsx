export default function PackageDetails({ errors, form, handleChange, inputClass }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">Package Details</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <input
          type="number"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={(e) => handleChange("weight", e.target.value)}
          className={`${inputClass} ${errors.weight ? "border-red-400" : ""}`}
        />
        <input
          type="text"
          placeholder="Package Type (Electronics, Food, etc)"
          value={form.packageType}
          onChange={(e) => handleChange("packageType", e.target.value)}
          className={`md:col-span-2 ${inputClass} ${
            errors.packageType ? "border-red-400" : ""
          }`}
        />
      </div>

      <textarea
        placeholder="Additional Notes (Optional)"
        value={form.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        className={`w-full mt-4 ${inputClass}`}
        rows="3"
      ></textarea>
    </div>
  );
}
