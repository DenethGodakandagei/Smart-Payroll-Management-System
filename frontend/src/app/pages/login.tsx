"use client";

import { useForm } from "react-hook-form";
import api from "../lib/api";
import { saveToken } from "../lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeyIcon, EnvelopeIcon, InformationCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

type Form = { email: string; password: string };

export default function Login() {
  const { register, handleSubmit } = useForm<Form>();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const onSubmit = async (data: Form) => {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      saveToken(res.data.token);
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden font-sans">
      {/* Decorative background glow blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" />
      
      <div className="max-w-md w-full mx-4 z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center font-bold text-white shadow-xl shadow-indigo-500/20 text-2xl mb-3">
            S
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">SmartPayroll</h1>
          <p className="text-zinc-400 mt-2 text-sm">Enterprise Payroll & HR Management System</p>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl bg-zinc-900/60 border border-zinc-800 shadow-2xl rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">Sign In</h2>
          
          {err && (
            <div className="flex gap-2 p-4 mb-5 rounded-2xl bg-red-950/20 border border-red-900/30 text-red-400 text-sm animate-fade-in">
              <InformationCircleIcon className="w-5 h-5 shrink-0" />
              <span>{err}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <EnvelopeIcon className="w-5 h-5" />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <KeyIcon className="w-5 h-5" />
                </span>
                <input
                  {...register("password")}
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In to Portal"
              )}
            </button>
          </form>

          {/* Quick Demo Access Credentials */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-between text-xs text-zinc-500 hover:text-zinc-300 transition duration-200 focus:outline-none"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <InformationCircleIcon className="w-4 h-4 text-indigo-400" />
                Forgot your credentials? Click here for Demo Access
              </span>
              {showDemo ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>

            {showDemo && (
              <div className="mt-3 p-3.5 bg-zinc-950/40 border border-zinc-800/60 rounded-2xl text-xs text-zinc-400 space-y-2 animate-slide-down">
                <p>Use the database administrator account below to sign in:</p>
                <div className="grid grid-cols-3 gap-1 items-center bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/40">
                  <span className="text-zinc-500 font-medium">Email:</span>
                  <span className="col-span-2 text-zinc-200 font-mono select-all">contact.deneth@gmail.com</span>
                </div>
                <div className="grid grid-cols-3 gap-1 items-center bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/40">
                  <span className="text-zinc-500 font-medium">Password:</span>
                  <span className="col-span-2 text-zinc-200 font-mono select-all">12345</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
