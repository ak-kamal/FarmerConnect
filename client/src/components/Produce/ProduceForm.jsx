import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadCloud, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const initialFormState = {
  produceName: "",
  category: "",
  quantity: "",
  region: "",
  pricePerUnit: "",
  qualityGrade: "",
  description: "",
  harvestDate: "",
  status: "UP_FOR_SALE",
};

const ProduceForm = ({ onUploaded, mode = "create", initialData = null, onCancel, onUpdated  }) => {
  const { token } = useAuth(); // use the same auth token as the rest of the app

  const [formData, setFormData] = useState(initialFormState);

useEffect(() => {
  if (mode === "edit" && initialData) {
    setFormData({
      produceName: initialData.produceName || "",
      category: initialData.category || "",
      quantity: initialData.quantity || "",
      region: initialData.region || "",
      pricePerUnit: initialData.pricePerUnit || "",
      qualityGrade: initialData.qualityGrade || "",
      description: initialData.description || "",
      harvestDate: initialData.harvestDate
        ? String(initialData.harvestDate).slice(0, 10)
        : "",
      status: initialData.status || "UP_FOR_SALE",
    });
    setFileData(null);
    setError(null);
    setSuccess(null);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [mode, initialData?._id]);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleFileChange = (e) => {
    setFileData(e.target.files[0] || null);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  if (!token) {
    setError("You must be logged in as a farmer to upload produce.");
    return;
  }

  setLoading(true);

  try {
    const dataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });

    if (fileData) {
      dataToSend.append("image", fileData);
    }

    if (mode === "edit") {
      if (!initialData?._id) throw new Error("Missing produce id for edit.");

      await axios.put(`/api/farmer/produce/${initialData._id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Produce updated successfully!");
      if (typeof onUpdated === "function") onUpdated();
      return; // ✅ IMPORTANT: stop here
    }

    // create mode
    await axios.post("/api/farmer/produce", dataToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSuccess("Produce details uploaded successfully!");
    setFormData(initialFormState);
    setFileData(null);
    e.target.reset();

    if (typeof onUploaded === "function") onUploaded();
  } catch (err) {
    console.error("Produce submit error:", err);
    setError(
      err.response?.data?.message ||
        err.message ||
        "Failed to save produce. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="card bg-black/60 border border-emerald-500/40 shadow-xl backdrop-blur-md">
      <div className="card-body space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300 mb-1">
              {mode === "edit" ? "Edit produce" : "Produce upload"}
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-white">
              {mode === "edit" ? "Update your produce details" : "Add a new harvest lot"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Share details so buyers and transporters can plan offers and trips.
            </p>
          </div>
          <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 items-center justify-center">
            <UploadCloud className="w-5 h-5 text-emerald-300" />
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error bg-red-900/40 border-red-500/40 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert bg-emerald-900/30 border-emerald-500/50 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Produce Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-200">
                Produce name
              </label>
              <input
                type="text"
                name="produceName"
                value={formData.produceName}
                onChange={handleChange}
                required
                className="input input-sm md:input-md input-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm placeholder:text-gray-500"
                placeholder="e.g., Tomatoes, Basmati rice"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-200">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input input-sm md:input-md input-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm placeholder:text-gray-500"
                placeholder="Vegetable, Fruit, Grain, etc."
              />
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-200">
                Quantity (kg)
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="input input-sm md:input-md input-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm"
              />
            </div>

            {/* Region */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-200">
                Region
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="input input-sm md:input-md input-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm placeholder:text-gray-500"
                placeholder="e.g., Rajshahi, Bogura"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-200">
                Price per kg (Taka)
              </label>
              <input
                type="number"
                name="pricePerUnit"
                min="0"
                step="0.01"
                value={formData.pricePerUnit}
                onChange={handleChange}
                required
                className="input input-sm md:input-md input-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm"
              />
            </div>

            {/* Grade */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-200">
                Quality grade
              </label>
              <select
                name="qualityGrade"
                value={formData.qualityGrade}
                onChange={handleChange}
                required
                className="select select-sm md:select-md select-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm"
              >
                <option value="">Select grade</option>
                <option value="A">A – Best quality</option>
                <option value="B">B – Good</option>
                <option value="C">C – Fair</option>
              </select>
            </div>

            {/* Harvest Date */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-200">
                Harvest date
              </label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                required
                className="input input-sm md:input-md input-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm"
              />
            </div>

            {/* Status (only in edit mode) */}
            {mode === "edit" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-200">
                  Availability status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="select select-sm md:select-md select-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm"
                  disabled={Number(formData.quantity) === 0} // ✅ optional (prevents changing if sold)
                >
                  <option value="UP_FOR_SALE">Up for sale</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                  <option value="SOLD">Sold</option>
                </select>

                {Number(formData.quantity) === 0 && (
                  <p className="text-[11px] text-gray-500">
                    Quantity is 0 → status stays Sold automatically.
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-200">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
              className="textarea textarea-bordered w-full bg-black/60 border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-sm placeholder:text-gray-500"
              placeholder="Short notes on size, freshness, packaging, preferred pickup time…"
            />

          </div>

          {mode === "edit" && initialData?.images?.[0] && (
  <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/40">
    <div className="px-3 py-2 border-b border-white/10">
      <p className="text-xs text-gray-300">Current image</p>
    </div>
    <img
      src={initialData.images[0]}
      alt="Current produce"
      className="w-full h-48 object-cover"
    />
  </div>
)}

          {/* Image upload */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-200 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-300" />
              Produce image (optional)
            </label>
            <input
              type="file"
              id="image-input"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-sm md:file-input-md file-input-bordered w-full bg-black/60 border-white/10 text-sm"
            />
            <p className="text-[11px] text-gray-500">
              JPG/PNG up to 5MB. A clear photo helps buyers trust the quality.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-2">
  {mode === "edit" && (
    <button
      type="button"
      onClick={onCancel}
      className="btn btn-sm md:btn-md rounded-full bg-black/40 border border-white/10 hover:bg-white/5"
      disabled={loading}
    >
      Cancel
    </button>
  )}

  <button
    type="submit"
    disabled={loading}
    className="btn btn-sm md:btn-md rounded-full bg-emerald-500 border-none text-black font-semibold hover:bg-emerald-400 disabled:bg-emerald-700 disabled:text-black flex items-center gap-2"
  >
    {loading ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{mode === "edit" ? "Saving…" : "Uploading…"}</span>
      </>
    ) : (
      <>
        {mode === "edit" ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <UploadCloud className="w-4 h-4" />
        )}
        <span>{mode === "edit" ? "Confirm changes" : "Upload produce details"}</span>
      </>
    )}
  </button>
</div>

        </form>
      </div>
    </div>
  );
};

export default ProduceForm;
