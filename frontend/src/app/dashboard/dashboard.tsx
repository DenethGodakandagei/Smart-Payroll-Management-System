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
      change: "Active registry members",
      icon: <UserGroupIcon className="w-5 h-5 text-zinc-800" />,
    },
    {
      name: "Payrolls Generated",
      value: "1",
      change: "Calculated this cycle",
      icon: <CurrencyDollarIcon className="w-5 h-5 text-zinc-800" />,
    },
    {
      name: "System Status",
      value: "Online",
      change: "All systems healthy",
      icon: <PresentationChartLineIcon className="w-5 h-5 text-zinc-800" />,
    }
  ];

  return (
    <div className="flex bg-[#f8f9fa] min-h-screen font-sans text-zinc-800">
      <Sidebar />
      
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* Mockup-style Greetings Header */}
        <div className="mb-10">
          <span className="text-zinc-400 text-sm font-semibold tracking-wide uppercase">SmartPayroll Dashboard</span>
          <h1 className="text-4xl font-extrabold text-zinc-950 tracking-tight mt-1">Welcome Back, Deneth Lakmal.</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-sm transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between h-40"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold text-zinc-500">{stat.name}</span>
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-700 shadow-sm">
                  {stat.icon}
                </div>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-zinc-950 tracking-tight leading-none block mb-1">
                  {stat.value}
                </span>
                <span className="text-xs text-zinc-450 font-semibold">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Control and Shortcuts Card */}
        <div className="rounded-3xl border border-zinc-200/85 bg-white p-8 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl">
            <h2 className="text-xl font-extrabold text-zinc-950 mb-2">Administrative Actions</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-medium">
              Easily update employee profiles, register work hours, log attendance, and compute salaries in a few clicks. Use the links below to access the operational portals.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/employees"
                className="px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-900 text-white text-sm font-bold transition shadow-sm"
              >
                Manage Employees
              </a>
              <a
                href="/attendance"
                className="px-5 py-2.5 rounded-full bg-[#2bd97b] hover:bg-[#22c55e] text-zinc-950 text-sm font-bold transition shadow-sm"
              >
                Record Attendance
              </a>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
