import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col justify-center px-6 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-700 text-white">
          <MapPin size={30} />
        </div>
        <h1 className="text-xl font-extrabold text-gray-900">FindBack BD</h1>
        <p className="text-xs text-gray-400">Lost &amp; Found, Together</p>
      </div>

      <div className="mb-6 flex rounded-full bg-gray-100 p-1">
        <button className="flex-1 rounded-full bg-brand-700 py-2.5 text-sm font-semibold text-white shadow-sm">
          Login
        </button>
        <Link
          to="/register"
          className="flex flex-1 items-center justify-center rounded-full py-2.5 text-sm font-semibold text-gray-500"
        >
          Register
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{error}</div>
        )}

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3.5 focus-within:border-brand-500">
          <Mail size={18} className="text-gray-400" />
          <input
            name="email"
            type="text"
            required
            placeholder="Email or Phone"
            value={form.email}
            onChange={onChange}
            className="w-full bg-transparent text-[15px] text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3.5 focus-within:border-brand-500">
          <Lock size={18} className="text-gray-400" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="w-full bg-transparent text-[15px] text-gray-800 outline-none placeholder:text-gray-400"
          />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-gray-400">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="text-right">
          <button type="button" className="text-xs font-medium text-brand-600">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brand-700 py-3.5 text-[15px] font-semibold text-white shadow-card transition-colors hover:bg-brand-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-100" />
        OR
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <button
        type="button"
        onClick={() => setError("Google sign-in isn't wired up in this build yet.")}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3.5 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 009 18z" />
          <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
        </svg>
        Continue with Google
      </button>

      <p>

        
      </p>



      
    </div>
  );
}
