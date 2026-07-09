"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import Link from "next/link";
import { Employee } from "../types";
import Sidebar from "@/app/components/Sidebar";
import { PlusIcon, IdentificationIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

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
    <div className="flex bg-[#f8f9fa] min-h-screen font-sans text-zinc-800">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">Employees</h1>
            <p className="text-zinc-500 text-sm mt-1 font-medium">Manage corporate staff details, credentials, and salaries.</p>
          </div>
          <Link
            href="/employees/create"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#2bd97b] hover:bg-[#22c55e] text-zinc-950 text-sm font-bold rounded-full shadow-sm active:scale-[0.98] transition-all duration-150"
          >
            <PlusIcon className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
            Add Employee
          </Link>
        </div>

        {/* Data Container */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-3 border-zinc-250 border-t-[#2bd97b] rounded-full animate-spin" />
              <span className="text-zinc-450 text-sm font-semibold">Loading employee records...</span>
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <IdentificationIcon className="w-12 h-12 text-zinc-400 mb-3" />
              <h3 className="text-zinc-800 font-bold text-base">No Employee Records</h3>
              <p className="text-zinc-500 text-sm mt-1 max-w-xs font-medium">
                Get started by adding your first employee to the SmartPayroll registry.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/80 bg-zinc-50/50 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Basic Salary</th>
                    <th className="p-4">NIC</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {list.map(e => (
                    <tr
                      key={e.employeeId}
                      className="hover:bg-zinc-50/50 transition duration-150 text-sm group"
                    >
                      <td className="p-4 pl-6 font-mono text-zinc-450 font-bold">
                        #{e.employeeId}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-zinc-900 group-hover:text-black transition">
                          {e.fullName}
                        </div>
                        <div className="text-xs text-zinc-500 font-semibold mt-0.5">{e.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#2bd97b]/10 border border-[#2bd97b]/20 text-[#15803d]">
                          <BriefcaseIcon className="w-3.5 h-3.5 stroke-[2]" />
                          {e.designation || "Staff"}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-zinc-900">
                        LKR {e.basicSalary !== undefined ? e.basicSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                      </td>
                      <td className="p-4 font-mono text-zinc-500 text-xs">
                        {e.nic || "N/A"}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <span className="text-zinc-400 text-xs font-semibold">
                          Active
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
