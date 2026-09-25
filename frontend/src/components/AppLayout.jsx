import React from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppLayout({ children, noPadBottom = false }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1200px] bg-white lg:shadow-card">
      <Sidebar />
      <div className="app-shell flex-1 lg:max-w-none lg:shadow-none">
        <main className={noPadBottom ? "" : "pb-20 md:pb-6"}>{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
