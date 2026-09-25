import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, PlusCircle, MessageCircle, User, Bell, Settings, MapPin, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/search", label: "Search Items", icon: Search },
  { to: "/create", label: "Create Report", icon: PlusCircle },
  { to: "/chat", label: "Messages", icon: MessageCircle },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-100 bg-white lg:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white">
          <MapPin size={18} />
        </div>
        <div>
          <p className="text-sm font-extrabold leading-none text-brand-800">FindBack BD</p>
          <p className="text-[11px] text-gray-400">Lost &amp; Found, Together</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-brand-50 text-brand-700" : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-brand-50 text-brand-700" : "text-gray-500 hover:bg-teal-100 hover:text-gray-700"
              }`
            }
          >
            <ShieldCheck size={19} />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {user && (
        <div className="mx-3 mb-5 flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              user.fullName?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">{user.fullName}</p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
