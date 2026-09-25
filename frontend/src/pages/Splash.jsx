import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem("fbbd_onboarded");
    const t = setTimeout(() => {
      navigate(seen ? "/login" : "/onboarding", { replace: true });
    }, 1400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-brand-800 px-8 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <svg viewBox="0 0 400 800" className="h-full w-full" preserveAspectRatio="xMidYMax slice">
          <path
            d="M0 620 L40 600 L60 560 L90 610 L120 580 L150 630 L180 590 L210 640 L240 600 L270 650 L300 610 L330 660 L360 620 L400 650 L400 800 L0 800 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="flex-1" />

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
          <MapPin size={44} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">FindBack BD</h1>
          <p className="mt-1 text-sm text-brand-100">Lost &amp; Found, Together</p>
        </div>
      </div>

      <div className="flex flex-1 items-end pb-4">
        <div className="h-1 w-28 rounded-full bg-white/25">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}
