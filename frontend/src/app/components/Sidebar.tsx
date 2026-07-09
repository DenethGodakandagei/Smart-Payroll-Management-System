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
    <aside className="w-64 min-h-screen bg-white border-r border-zinc-200/80 flex flex-col justify-between text-zinc-800 select-none font-sans shrink-0">
      <div>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2bd97b] flex items-center justify-center font-bold text-zinc-950 shadow-sm">
              S
            </div>
            <span className="text-xl font-bold text-zinc-950 tracking-tight">
              SmartPayroll
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 group text-sm font-medium ${
                  isActive
                    ? "bg-[#2bd97b] text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <div className={`transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-700"}`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session & Logout */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
        <div className="flex items-center gap-3 px-2 py-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-zinc-150 border border-zinc-200 flex items-center justify-center text-zinc-700 font-semibold text-sm">
            DL
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 leading-tight">Deneth Lakmal</h4>
            <span className="text-xs text-zinc-500">Administrator</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-zinc-200 text-sm font-medium text-zinc-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50/50 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
