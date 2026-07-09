"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import Link from "next/link";
import { Employee } from "../types";
import Sidebar from "@/app/components/Sidebar";
import { PlusIcon, IdentificationIcon, BriefcaseIcon, BanknotesIcon } from "@heroicons/react/24/outline";

export default function EmployeesPage() {
  const [list, setList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/employees")
      .then(r => setList(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex bg-zinc-950 min-h-screen font-sans text-zinc-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        {/* Page Header */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Employees</h1>
            <p className="text-zinc-400 text-sm mt-1">Manage corporate staff details, credentials, and salaries.</p>
          </div>
          <Link
            href="/employees/create"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all duration-150"
          >
            <PlusIcon className="w-4 h-4" />
            Add Employee
          </Link>
        </div>

        {/* Data Container */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-3 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-zinc-400 text-sm font-medium">Loading employee records...</span>
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <IdentificationIcon className="w-12 h-12 text-zinc-600 mb-3" />
              <h3 className="text-zinc-300 font-semibold text-base">No Employee Records</h3>
              <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                Get started by adding your first employee to the SmartPayroll registry.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Basic Salary</th>
                    <th className="p-4">NIC</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {list.map(e => (
                    <tr
                      key={e.employeeId}
                      className="hover:bg-zinc-900/40 transition duration-150 text-sm group"
                    >
                      <td className="p-4 pl-6 font-mono text-zinc-500 font-semibold">
                        #{e.employeeId}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-zinc-100 group-hover:text-white transition">
                          {e.fullName}
                        </div>
                        <div className="text-xs text-zinc-500 font-medium mt-0.5">{e.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-950/40 border border-indigo-900/30 text-indigo-400">
                          <BriefcaseIcon className="w-3.5 h-3.5" />
                          {e.designation || "Staff"}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-medium text-emerald-400">
                        LKR {e.basicSalary !== undefined ? e.basicSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                      </td>
                      <td className="p-4 font-mono text-zinc-400 text-xs">
                        {e.nic || "N/A"}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <span className="text-zinc-500 text-xs font-medium">
                          No further actions
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
