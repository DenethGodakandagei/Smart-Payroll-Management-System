"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "@/app/components/Sidebar";
import { UserGroupIcon, CalendarDaysIcon, CurrencyDollarIcon, PresentationChartLineIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/employees")
      .then(res => {
        setEmployeeCount(res.data.length);
      })
      .catch(() => {
        setEmployeeCount(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const stats = [
    {
      name: "Total Employees",
      value: loading ? "..." : employeeCount !== null ? employeeCount.toString() : "0",
      change: "Active in database",
      icon: <UserGroupIcon className="w-6 h-6 text-indigo-400" />,
      bg: "from-indigo-500/10 to-indigo-600/5",
      border: "border-indigo-500/20"
    },
    {
      name: "Payrolls Generated",
      value: "1",
      change: "This month",
      icon: <CurrencyDollarIcon className="w-6 h-6 text-emerald-400" />,
      bg: "from-emerald-500/10 to-emerald-600/5",
      border: "border-emerald-500/20"
    },
    {
      name: "System Status",
      value: "Online",
      change: "All services running",
      icon: <PresentationChartLineIcon className="w-6 h-6 text-violet-400" />,
      bg: "from-violet-500/10 to-violet-600/5",
      border: "border-violet-500/20"
    }
  ];

  return (
    <div className="flex bg-zinc-950 min-h-screen font-sans text-zinc-100">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-zinc-400 text-sm mt-1">Real-time Smart Payroll system overview.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Database Connected
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-gradient-to-br ${stat.bg} border ${stat.border} shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between h-40`}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-zinc-400">{stat.name}</span>
                <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/40 shadow-inner">
                  {stat.icon}
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold text-white tracking-tight leading-none block mb-1">
                  {stat.value}
                </span>
                <span className="text-xs text-zinc-500 font-medium">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Welcome & Action panel */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-md relative overflow-hidden">
          <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full bg-indigo-500/5 blur-[80px]" />
          
          <h2 className="text-xl font-bold text-white mb-2">Welcome Back, Deneth Lakmal!</h2>
          <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed mb-6">
            You are signed in as a system Administrator. From this control panel, you can manage active employee records, record working hours for attendance tracking, and calculate and verify monthly payroll processing.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/employees"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-md shadow-indigo-600/10"
            >
              Manage Employees
            </a>
            <a
              href="/attendance"
              className="px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold transition"
            >
              Record Attendance
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
