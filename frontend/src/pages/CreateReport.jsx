import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Image as ImageIcon, MapPin, X } from "lucide-react";
import AppLayout from "../components/AppLayout";
import TopBar from "../components/TopBar";
import { CATEGORIES } from "../utils/categories";
import api from "../api/axios";

const MAX_IMAGES = 5;

export default function CreateReport() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [type, setType] = useState("lost");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([]); // { file, url }
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);

  const onPickImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_IMAGES - images.length);
    const next = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...next].slice(0, MAX_IMAGES));
    e.target.value = "";
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation isn't available in this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setAddress((prev) => prev || `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location. You can type it manually.");
        setLocating(false);
      }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!category || !name.trim() || !description.trim()) {
      setError("Please fill in category, item name and description.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("type", type);
      fd.append("category", category);
      fd.append("name", name.trim());
      fd.append("description", description.trim());
      fd.append("address", address.trim());
      if (coords) {
        fd.append("lat", coords.lat);
        fd.append("lng", coords.lng);
      }
      images.forEach((img) => fd.append("images", img.file));

      const { data } = await api.post("/items", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/item/${data.item._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <TopBar title="Create Report" back />

      <form onSubmit={onSubmit} className="space-y-5 px-5 py-5">
        {error && <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{error}</div>}

        <div className="flex rounded-full bg-gray-100 p-1">
          {[
            { value: "lost", label: "Lost" },
            { value: "found", label: "Found" },
          ].map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() => setType(t.value)}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                type === t.value ? "bg-brand-700 text-white shadow-sm" : "text-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">Item Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-800 outline-none focus:border-brand-500"
          >
            <option value="" disabled>
              Select category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">Item Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Wallet"
            required
            className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item in detail..."
            required
            rows={4}
            className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">Images</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= MAX_IMAGES}
              className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 text-gray-400 disabled:opacity-40"
            >
              <Camera size={18} />
              <span className="text-[10px]">Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= MAX_IMAGES}
              className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 text-gray-400 disabled:opacity-40"
            >
              <ImageIcon size={18} />
              <span className="text-[10px]">Gallery</span>
            </button>
            {images.map((img, idx) => (
              <div key={img.url} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onPickImages}
              className="hidden"
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">Add Images ({images.length}/{MAX_IMAGES})</p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">Location</label>
          <button
            type="button"
            onClick={useMyLocation}
            className="flex w-full items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3.5 text-left text-[15px] text-gray-500"
          >
            <MapPin size={17} className="shrink-0 text-gray-400" />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Select location on map"
              className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
            />
            <span className="shrink-0 text-xs font-semibold text-brand-600">
              {locating ? "..." : "Use GPS"}
            </span>
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brand-700 py-3.5 text-[15px] font-semibold text-white shadow-card transition-colors hover:bg-brand-800 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </AppLayout>
  );
}
