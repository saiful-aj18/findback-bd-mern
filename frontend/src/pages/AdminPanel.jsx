import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FileText, Users, ShieldAlert, BarChart3, Flag, Trash2, Ban, CheckCircle } from "lucide-react";
import AppLayout from "../components/AppLayout";
import TopBar from "../components/TopBar";
import { CATEGORY_ICONS } from "../utils/categories";
import { timeAgo } from "../utils/time";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const TABS = [
  { key: "overview", label: "Analytics", icon: BarChart3 },
  { key: "reports", label: "Manage Reports", icon: FileText },
  { key: "flagged", label: "Reported Content", icon: ShieldAlert },
  { key: "users", label: "Manage Users", icon: Users },
];

export default function AdminPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, reportsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/reports"),
        api.get("/admin/users"),
      ]);
      setStats(statsRes.data);
      setReports(reportsRes.data.items || []);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  if (user && user.role !== "admin") return <Navigate to="/home" replace />;

  const toggleFlag = async (id) => {
    try {
      const { data } = await api.patch(`/admin/reports/${id}/flag`);
      setReports((prev) => prev.map((r) => (r._id === id ? { ...r, isFlagged: data.item.isFlagged } : r)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update report");
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete this report permanently?")) return;
    try {
      await api.delete(`/admin/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete report");
    }
  };

  const toggleBan = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/ban`);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBanned: data.user.isBanned } : u)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const flaggedReports = reports.filter((r) => r.isFlagged);

  return (
    <AppLayout>
      <TopBar title="Admin Panel" />

      <div className="flex gap-2 overflow-x-auto px-5 py-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
              tab === t.key ? "bg-brand-700 text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3 px-5 py-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="mx-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
      )}

      {!loading && !error && tab === "overview" && stats && (
        <div className="grid grid-cols-2 gap-3 px-5 py-2 pb-6">
          {[
            { label: "Total Users", value: stats.users },
            { label: "Total Reports", value: stats.items },
            { label: "Lost Items", value: stats.lost },
            { label: "Found Items", value: stats.found },
            { label: "Matched", value: stats.matched },
            { label: "Flagged", value: stats.flagged },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-100 p-4">
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
              <p className="mt-0.5 text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (tab === "reports" || tab === "flagged") && (
        <div className="space-y-3 px-5 py-2 pb-6">
          {(tab === "flagged" ? flaggedReports : reports).length === 0 && (
            <p className="rounded-2xl bg-gray-50 px-4 py-10 text-center text-sm text-gray-400">
              {tab === "flagged" ? "No flagged reports." : "No reports yet."}
            </p>
          )}
          {(tab === "flagged" ? flaggedReports : reports).map((item) => {
            const Icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.Others;
            return (
              <div
                key={item._id}
                className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  item.isFlagged ? "border-rose-200 bg-rose-50/40" : "border-gray-100"
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="truncate text-xs text-gray-400">
                    {item.user?.fullName} · {item.type === "lost" ? "Lost" : "Found"} · {timeAgo(item.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => toggleFlag(item._id)}
                  title={item.isFlagged ? "Unflag" : "Flag"}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    item.isFlagged ? "bg-rose-100 text-rose-600" : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <Flag size={15} />
                </button>
                <button
                  onClick={() => deleteReport(item._id)}
                  title="Delete"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && tab === "users" && (
        <div className="space-y-3 px-5 py-2 pb-6">
          {users.map((u) => (
            <div key={u._id} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {u.avatar ? (
                  <img src={u.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  u.fullName?.[0]?.toUpperCase() || "U"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {u.fullName}
                  {u.role === "admin" && (
                    <span className="ml-1.5 rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-600">
                      Admin
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-gray-400">{u.email}</p>
              </div>
              {u.role !== "admin" && (
                <button
                  onClick={() => toggleBan(u._id)}
                  className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    u.isBanned ? "bg-brand-50 text-brand-700" : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {u.isBanned ? <CheckCircle size={13} /> : <Ban size={13} />}
                  {u.isBanned ? "Unban" : "Ban"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
