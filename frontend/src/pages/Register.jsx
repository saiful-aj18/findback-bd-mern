import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.token, data.user);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
        <h1 className="text-xl font-extrabold text-gray-900">Create Your Account</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{error}</div>
        )}

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3.5 focus-within:border-brand-500">
          <User size={18} className="text-gray-400" />
          <input
            name="fullName"
            required
            placeholder="Full Name"
            value={form.fullName}
            onChange={onChange}
            className="w-full bg-transparent text-[15px] text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3.5 focus-within:border-brand-500">
          <Mail size={18} className="text-gray-400" />
          <input
            name="email"
            type="email"
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
            minLength={6}
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="w-full bg-transparent text-[15px] text-gray-800 outline-none placeholder:text-gray-400"
          />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-gray-400">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3.5 focus-within:border-brand-500">
          <Lock size={18} className="text-gray-400" />
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={onChange}
            className="w-full bg-transparent text-[15px] text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brand-700 py-3.5 text-[15px] font-semibold text-white shadow-card transition-colors hover:bg-brand-800 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600">
          Login
        </Link>
      </p>
    </div>
  );
}
