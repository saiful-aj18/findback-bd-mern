import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Lock,
  Moon,
  Globe,
  Bell,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
} from "lucide-react";
import AppLayout from "../components/AppLayout";
import TopBar from "../components/TopBar";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Row({ icon: Icon, label, sub, right, onClick, to }) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-gray-100">
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-gray-800">{label}</span>
        {sub && <span className="block text-xs text-gray-400">{sub}</span>}
      </span>
      {right}
    </>
  );

  const className = "flex w-full items-center gap-3 px-4 py-3.5 text-left";

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function SectionLabel({ children }) {
  return <p className="mb-2 mt-6 px-1 text-xs font-bold uppercase tracking-wide text-gray-400">{children}</p>;
}

export default function Settings() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = useState(() => localStorage.getItem("fbbd_push") !== "0");

  const togglePush = () => {
    setPushEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("fbbd_push", next ? "1" : "0");
      return next;
    });
  };

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppLayout>
      <TopBar title="Settings" back />

      <div className="px-5 pb-8">
        <SectionLabel>Account</SectionLabel>
        <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100">
          <Row icon={User} label="Edit Profile" to="/profile" right={<ChevronRight size={17} className="text-gray-300" />} />
          <Row
            icon={Lock}
            label="Change Password"
            to="/settings/password"
            right={<ChevronRight size={17} className="text-gray-300" />}
          />
        </div>

        <SectionLabel>Preferences</SectionLabel>
        <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100">
          <Row
            icon={Moon}
            label="Dark Mode"
            sub={isDark ? "On " : "Off"}
            right={<ThemeToggle />}
          />
          <Row
            icon={Globe}
            label="Language"
            sub="English"
            right={<ChevronRight size={17} className="text-gray-300" />}
            to="/settings/language"
          />
        </div>

        <SectionLabel>Notifications</SectionLabel>
        <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100">
          <Row
            icon={Bell}
            label="Push Notifications"
            sub={pushEnabled ? "On" : "Off"}
            right={
              <button
                onClick={togglePush}
                role="switch"
                aria-checked={pushEnabled}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  pushEnabled ? "bg-cyan-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                    pushEnabled ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            }
          />
        </div>

        <SectionLabel>About</SectionLabel>
        <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100">
          <Row icon={HelpCircle} label="Help & Support" to="/settings/help" right={<ChevronRight size={17} className="text-gray-300" />} />
          <Row icon={Info} label="About FindBack BD" to="/settings/about" right={<ChevronRight size={17} className="text-gray-300" />} />
        </div>

        {user && (
          <button
            onClick={onLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            <LogOut size={16} />
            Log Out
          </button>
        )}
      </div>
    </AppLayout>
  );
}
