import React from "react";
import { useNavigate } from "react-router-dom";
import { Backpack, MapPinned, Camera } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();

  const finish = () => {
    localStorage.setItem("fbbd_onboarded", "1");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell flex h-screen flex-col justify-between bg-white px-6 py-10">
      <div className="flex justify-end">
        <button onClick={finish} className="text-sm font-medium text-gray-400">
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div className="relative flex h-56 w-56 items-center justify-center rounded-full bg-brand-50">
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-lg">
            <Backpack size={44} />
          </div>
          <div className="absolute -right-2 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white shadow-md">
            <MapPinned size={20} />
          </div>
          <div className="absolute -left-3 bottom-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-600 shadow-md">
            <Camera size={20} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Report Lost &amp; Found Items</h2>
          <p className="mx-auto mt-3 max-w-[280px] text-[15px] leading-relaxed text-gray-500">
            Easily report lost or found items with photos, location, and details.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-5 rounded-full bg-brand-600" />
          <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
          <span className="h-1.5 w-1.5 rounded-full bg-gray-200" />
        </div>
      </div>

      <button
        onClick={finish}
        className="w-full rounded-2xl bg-brand-700 py-3.5 text-[15px] font-semibold text-white shadow-card transition-colors hover:bg-brand-800"
      >
        Next
      </button>
    </div>
  );
}
