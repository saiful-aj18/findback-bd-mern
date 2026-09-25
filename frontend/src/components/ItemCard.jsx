import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { CATEGORY_ICONS } from "../utils/categories";
import { timeAgo } from "../utils/time";

export default function ItemCard({ item }) {
  const Icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.Others;
  const isLost = item.type === "lost";

  return (
    <Link
      to={`/item/${item._id}`}
      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-50 text-brand-600">
        {item.images?.[0] ? (
          <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <Icon size={24} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
        <div className="mt-0.5 flex items-center gap-1 text-xs">
          <span className={isLost ? "text-rose-500" : "text-brand-600"}>●</span>
          <span className={isLost ? "text-rose-500" : "text-brand-600"}>
            {isLost ? "Lost" : "Found"}
          </span>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-0.5 truncate text-gray-400">
            <MapPin size={11} />
            {item.location?.address || "Location unknown"}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 text-[11px] text-gray-400">
        <span className="flex items-center gap-0.5">
          <Clock size={11} /> {timeAgo(item.createdAt)}
        </span>
      </div>
    </Link>
  );
}
