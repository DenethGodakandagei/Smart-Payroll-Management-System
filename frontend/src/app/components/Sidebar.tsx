"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../lib/auth";
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, href: "/dashboard" },
    { name: "Employees", icon: <UserGroupIcon className="w-5 h-5" />, href: "/employees" },
    { name: "Attendance", icon: <CalendarDaysIcon className="w-5 h-5" />, href: "/attendance" },
    { name: "Payroll", icon: <CurrencyDollarIcon className="w-5 h-5" />, href: "/payroll" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between text-zinc-300 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              S
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent tracking-tight">
              SmartPayroll
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-600/15"
                    : "hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                <div className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session & Logout */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-2 py-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm shadow">
            DA
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100 leading-tight">Deneth Lakmal</h4>
            <span className="text-xs text-zinc-500">Administrator</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-800 text-sm font-medium text-zinc-400 hover:text-red-400 hover:border-red-900/30 hover:bg-red-950/10 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
