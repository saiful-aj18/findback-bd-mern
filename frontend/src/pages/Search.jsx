import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import AppLayout from "../components/AppLayout";
import TopBar from "../components/TopBar";
import ItemCard from "../components/ItemCard";
import { CATEGORIES } from "../utils/categories";
import api from "../api/axios";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const type = params.get("type") || "all";
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "newest";
  const mine = params.get("mine") === "1";
  const status = params.get("status") || "all";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    const t = setTimeout(() => setParam("q", q), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/items", {
          params: {
            q: params.get("q") || undefined,
            type,
            category,
            status,
            sort,
            limit: 30,
            mine: mine ? 1 : undefined,
          },
        });
        if (!ignore) setItems(data.items || []);
      } catch (err) {
        if (!ignore) setError("Couldn't load items. Is the backend running?");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get("q"), type, category, sort, mine, status]);

  const categoryOptions = useMemo(() => ["all", ...CATEGORIES], []);

  return (
    <AppLayout>
      <TopBar title={mine ? (status === "Matched" ? "My Matches" : "My Reports") : "Search Items"} back />

      <div className="px-5 py-4">
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <SearchIcon size={17} className="text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by keyword..."
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 pb-3">
        <select
          value={category}
          onChange={(e) => setParam("category", e.target.value)}
          className="shrink-0 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 outline-none"
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Category" : c}
            </option>
          ))}
        </select>

        <select
          disabled
          title="Location filter coming soon"
          className="shrink-0 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-400 outline-none"
        >
          <option>Location</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              Sort: {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="px-5 pb-3">
        <div className="flex w-full rounded-full bg-gray-100 p-1">
          {[
            { value: "all", label: "All" },
            { value: "lost", label: "Lost" },
            { value: "found", label: "Found" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setParam("type", t.value)}
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition-colors ${
                type === t.value ? "bg-brand-700 text-white shadow-sm" : "text-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6">
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-gray-50 px-4 py-10 text-center">
            <SlidersHorizontal size={22} className="text-gray-300" />
            <p className="text-sm text-gray-400">No items match your filters. Try widening your search.</p>
          </div>
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
