import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  MessageCircle,
  Star,
  Settings as SettingsIcon,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ reports: 0, matches: 0, rating: 0, ratingCount: 0 });

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get("/items/stats/mine");
        if (!ignore) setStats(data);
      } catch {
        // stats are supplementary — page still works without them
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const menu = [
    { to: "/search?mine=1", label: "My Reports", icon: FileText },
    { to: "/search?mine=1&status=Matched", label: "My Matches", icon: CheckCircle2 },
    { to: "/chat", label: "Messages", icon: MessageCircle },
    { to: "/profile/reviews", label: "Reviews", icon: Star },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  if (user?.role === "admin") {
    menu.push({ to: "/admin", label: "Admin Panel", icon: ShieldCheck });
  }

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppLayout>
      <TopBar title="Profile" back/>  
      
      <div className="flex flex-col items-center px-5 py-6">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            user?.fullName?.[0]?.toUpperCase() || "U"
          )}
        </div>
        <h1 className="mt-3 text-lg font-extrabold text-gray-900">{user?.fullName}</h1>
        <p className="text-sm text-gray-400">{user?.email}</p>

        <div className="mt-5 flex w-full max-w-xs items-center justify-around rounded-2xl border border-gray-100 py-4">
          <div className="text-center">
            <p className="text-base font-extrabold text-teal-800">{stats.reports}</p>
            <p className="text-[11px] text-gray-400">Reports</p>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="text-center">
            <p className="text-base font-extrabold text-teal-800">{stats.matches}</p>
            <p className="text-[11px] text-gray-400">Matches</p>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="text-center">
            <p className="text-base font-extrabold text-teal-700">
              {stats.rating ? stats.rating.toFixed(1) : "—"}
            </p>
            <p className="text-[11px] text-gray-400">Rating</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-6">
        <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100">
          {menu.map(({ to, label, icon: Icon }) => (
            <Link key={label} to={to} className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 text-gray-100">
                <Icon size={17} />
              </span>
              <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
              <ChevronRight size={17} className="text-gray-300" />
            </Link>
          ))}
        </div>

        <button
          onClick={onLogout}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </AppLayout>
  );
}
