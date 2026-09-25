import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, MapPin, FileText } from "lucide-react";
import AppLayout from "../components/AppLayout";
import ItemCard from "../components/ItemCard";
import { CATEGORIES, CATEGORY_ICONS } from "../utils/categories";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/items", { params: { sort: "newest", limit: 3 } });
        if (!ignore) setItems(data.items || []);
      } catch (err) {
        if (!ignore) setError("Couldn't load recent reports. Is the backend running?");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AppLayout>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/95 px-5 py-3.5 backdrop-blur safe-top">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white">
            <MapPin size={16} />
          </div>
          <Link to="/home" >
          <h1 className="text-[17px] font-bold text-gray-900">FindBack BD</h1>
          </Link>
        </div>
        <Link
          to="/notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </Link>
      </header>

      <div className="px-5 py-4">
        <button
          onClick={() => navigate("/search")}
          className="flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-400"
        >
          <Search size={17} />
          Search items, categories...
        </button>
      </div>

      <div className="px-5">
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-brand-700 to-brand-800 px-5 py-5 text-white shadow-card">
          <div>
            <p className="text-[15px] font-bold">Lost Something?</p>
            <p className="mt-0.5 max-w-[170px] text-xs text-brand-100">
              Report it and get help finding it fast.
            </p>
            <button
              onClick={() => navigate("/create")}
              className="mt-3 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-800"
            >
              <FileText size={14} />
              Report Now
            </button>
          </div>
          <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex">
            <Search size={34} />
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            return (
              <button
                key={cat}
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <Icon size={22} />
                </span>
                <span className="text-[11px] font-medium text-gray-600">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-gray-900">Recent Reports</h2>
          <Link to="/search" className="text-xs font-semibold text-brand-600">
            View All
          </Link>
        </div>

        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">
            No reports yet. Be the first to report a lost or found item{user ? `, ${user.fullName.split(" ")[0]}` : ""}.
          </p>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
