import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { MapPin, Clock, MessageCircle, Phone, Trash2 } from "lucide-react";
import AppLayout from "../components/AppLayout";
import TopBar from "../components/TopBar";
import { CATEGORY_ICONS } from "../utils/categories";
import { timeAgo } from "../utils/time";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/items/${id}`);
        if (!ignore) setItem(data.item);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Item not found");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  const isOwner = user && item && String(item.user?._id) === String(user._id);

  const handleDelete = async () => {
    if (!window.confirm("Delete this report? This cannot be undone.")) return;
    try {
      await api.delete(`/items/${id}`);
      navigate("/home", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete report");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <TopBar title="Item Details" back />
        <div className="space-y-4 p-5">
          <div className="h-56 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
          <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </AppLayout>
    );
  }

  if (error || !item) {
    return (
      <AppLayout>
        <TopBar title="Item Details" back />
        <p className="p-6 text-center text-sm text-rose-600">{error || "Item not found"}</p>
      </AppLayout>
    );
  }

  const Icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.Others;
  const isLost = item.type === "lost";

  return (
    <AppLayout>
      <TopBar
        title="Item Details"
        back
        right={
          isOwner && (
            <button
              onClick={handleDelete}
              className="flex h-8 w-8 items-center justify-center rounded-full text-rose-500 hover:bg-rose-50"
              aria-label="Delete report"
            >
              <Trash2 size={17} />
            </button>
          )
        }
      />

      <div className="px-5 pt-4">
        <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-brand-50">
          {item.images?.length ? (
            <img src={item.images[activeImg]} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <Icon size={56} className="text-brand-300" />
          )}
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${
              isLost ? "bg-rose-500" : "bg-brand-600"
            }`}
          >
            {isLost ? "Lost" : "Found"}
          </span>
        </div>

        {item.images?.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {item.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImg(i)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 ${
                  i === activeImg ? "border-brand-600" : "border-transparent"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-extrabold text-gray-900">{item.name}</h1>
          <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {item.category}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {item.location?.address || "Location unknown"}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {timeAgo(item.createdAt)}
          </span>
        </div>

        <div className="mt-4">
          <h2 className="mb-1.5 text-sm font-bold text-gray-900">Description</h2>
          <p className="text-[15px] leading-relaxed text-gray-600">{item.description}</p>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-100 p-4">
          <h2 className="mb-3 text-sm font-bold text-gray-900">Contact</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {item.user?.avatar ? (
                <img src={item.user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                item.user?.fullName?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">{item.user?.fullName}</p>
              <p className="truncate text-xs text-gray-400">{item.user?.phone || item.user?.email}</p>
            </div>
          </div>

          {!isOwner && (
            <div className="mt-4 flex gap-2">
              <Link
                to={`/chat?with=${item.user?._id}&item=${item._id}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-700 py-2.5 text-sm font-semibold text-white"
              >
                <MessageCircle size={16} />
                Message
              </Link>
              <a
                href={item.user?.phone ? `tel:${item.user.phone}` : undefined}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold ${
                  item.user?.phone
                    ? "border-brand-700 text-brand-700"
                    : "pointer-events-none border-gray-200 text-gray-300"
                }`}
              >
                <Phone size={16} />
                Call
              </a>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
