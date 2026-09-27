import React from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppLayout({ children, noPadBottom = false }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="app-shell flex min-w-0 flex-1 md:max-w-none md:shadow-none">
        <main
          className={
            noPadBottom
              ? "w-full"
              : "w-full pb-20 md:pb-6"
          }
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}