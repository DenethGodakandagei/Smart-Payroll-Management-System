"use client";

import { useState } from "react";
import api from "../lib/api";
import dayjs from "dayjs";
import Sidebar from "@/app/components/Sidebar";
import { DocumentTextIcon, CalendarIcon, PlayIcon, IdentificationIcon } from "@heroicons/react/24/outline";

export default function PayrollPage() {
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAll = async () => {
    setError(null);
    setLoading(true);
    try {
      const m = dayjs(month + "-01").format("YYYY-MM-DD");
      const res = await api.post(`/payroll/generate/all?month=${encodeURIComponent(m)}`);
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || "Failed to generate payroll. Ensure employee basic salaries and attendance logs exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#f8f9fa] min-h-screen font-sans text-zinc-800">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">

        {/* Page Header */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">Payroll Processing</h1>
            <p className="text-zinc-500 text-sm mt-1 font-medium">Calculate salaries, apply taxes, EPF/ETF, and issue payslips.</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm h-fit">
              <h2 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#2bd97b] stroke-[2]" />
                Select Salary Cycle
              </h2>

              {error && (
                <div className="p-4 mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-650 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Month & Year</label>
                  <input
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    type="month"
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200 [color-scheme:light]"
                  />
                </div>

                <button
                  onClick={generateAll}
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#2bd97b] hover:bg-[#22c55e] text-zinc-950 font-bold text-sm rounded-full shadow-sm active:scale-[0.98] transition-all duration-155 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <PlayIcon className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
                      Generate All Payroll
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results table */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-zinc-200/80 bg-zinc-50/50">
                <h3 className="text-sm font-bold text-zinc-500">Generated Payroll List</h3>
              </div>

              {result.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <DocumentTextIcon className="w-12 h-12 text-zinc-400 mb-3" />
                  <h4 className="text-zinc-800 font-bold text-sm">No Payrolls Calculated Yet</h4>
                  <p className="text-zinc-500 text-xs mt-1 max-w-xs font-semibold">
                    Choose a month and click "Generate All Payroll" to run calculations for the cycle.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200/80 bg-zinc-50/50 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <th className="p-4 pl-6">Employee</th>
                        <th className="p-4">Month</th>
                        <th className="p-4 text-right pr-6">Net Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {result.map((r: any) => (
                        <tr key={r.payrollId} className="hover:bg-zinc-50/50 transition duration-150 text-sm group">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/60 text-zinc-400 group-hover:text-zinc-700 transition">
                                <IdentificationIcon className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-zinc-800 group-hover:text-black transition">
                                {r.employee?.fullName || `Employee #${r.employeeId}`}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-zinc-555 text-xs font-semibold">
                            {dayjs(r.month).format("MMMM YYYY")}
                          </td>
                          <td className="p-4 pr-6 text-right font-mono font-extrabold text-emerald-600">
                            LKR {Number(r.netSalary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
