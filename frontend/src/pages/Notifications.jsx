import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, CheckCircle2, Sparkles, PartyPopper, Bell } from "lucide-react";
import AppLayout from "../components/AppLayout";
import TopBar from "../components/TopBar";
import { timeAgo } from "../utils/time";
import api from "../api/axios";

const TYPE_META = {
  match: { icon: Heart, bg: "bg-rose-50", fg: "text-rose-500" },
  message: { icon: MessageCircle, bg: "bg-blue-50", fg: "text-blue-500" },
  status: { icon: CheckCircle2, bg: "bg-brand-50", fg: "text-brand-600" },
  system: { icon: PartyPopper, bg: "bg-brand-50", fg: "text-brand-600" },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/notifications");
      setItems(data.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // silently ignore — not critical
    }
  };

  const onOpen = async (n) => {
    if (!n.read) {
      setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
      api.patch(`/notifications/${n._id}/read`).catch(() => {});
    }
    if (n.relatedItem) navigate(`/item/${n.relatedItem._id || n.relatedItem}`);
  };

  const hasUnread = items.some((n) => !n.read);

  return (
    <AppLayout>
      <TopBar
        title="Notifications"
        right={
          hasUnread && (
            <button onClick={markAllRead} className="text-xs font-semibold text-brand-600">
              Mark all read
            </button>
          )
        }
      />

      <div className="px-5 py-3">
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-gray-50 px-4 py-14 text-center">
            <Bell size={26} className="text-gray-300" />
            <p className="text-sm text-gray-400">You're all caught up — no notifications yet.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-1">
            {items.map((n) => {
              const meta = TYPE_META[n.type] || TYPE_META.system;
              const Icon = meta.icon;
              return (
                <button
                  key={n._id}
                  onClick={() => onOpen(n)}
                  className={`flex w-full items-start gap-3 rounded-2xl px-2 py-3 text-left transition-colors hover:bg-gray-50 ${
                    !n.read ? "bg-brand-50/40" : ""
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.bg} ${meta.fg}`}>
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">{n.title}</p>
                      {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
                    </div>
                    {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{n.body}</p>}
                    <p className="mt-1 text-[11px] text-gray-400">{timeAgo(n.createdAt)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
