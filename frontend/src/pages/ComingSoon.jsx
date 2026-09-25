import React from "react";
import { Construction, LogOut } from "lucide-react";
import AppLayout from "../components/AppLayout";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ComingSoon({ title, note, showLogout = false }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <TopBar title={title} back />
      <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Construction size={26} />
        </div>
        <h2 className="text-base font-bold text-gray-900">{title} is on the way</h2>
        <p className="text-sm text-gray-500">
          {note || "This screen is planned for the next build phase, once the core report flow is confirmed."}
        </p>

        {showLogout && user && (
          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600"
          >
            <LogOut size={16} />
            Log out {user.fullName}
          </button>
        )}
      </div>
    </AppLayout>
  );
}
