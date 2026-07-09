"use client";

import { useState } from "react";
import api from "../lib/api";
import dayjs from "dayjs";
import Sidebar from "@/app/components/Sidebar";
import { DocumentTextIcon, CalendarIcon, PlayIcon, CurrencyDollarIcon, IdentificationIcon } from "@heroicons/react/24/outline";

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
    <div className="flex bg-zinc-950 min-h-screen font-sans text-zinc-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        {/* Page Header */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Payroll Processing</h1>
            <p className="text-zinc-400 text-sm mt-1">Calculate salaries, apply taxes, EPF/ETF, and issue payslips.</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md p-6 shadow-xl h-fit">
              <h2 className="text-base font-semibold text-zinc-150 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-400" />
                Select Salary Cycle
              </h2>

              {error && (
                <div className="p-3 mb-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Month & Year</label>
                  <input
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    type="month"
                    className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200 [color-scheme:dark]"
                  />
                </div>

                <button
                  onClick={generateAll}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <PlayIcon className="w-4 h-4" />
                      Generate All Payroll
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results table */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md overflow-hidden shadow-xl">
              <div className="p-5 border-b border-zinc-800 bg-zinc-950/20">
                <h3 className="text-sm font-semibold text-zinc-300">Generated Payroll List</h3>
              </div>

              {result.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <DocumentTextIcon className="w-12 h-12 text-zinc-700 mb-3" />
                  <h4 className="text-zinc-400 font-semibold text-sm">No Payrolls Calculated Yet</h4>
                  <p className="text-zinc-550 text-xs mt-1 max-w-xs">
                    Choose a month and click "Generate All Payroll" to run calculations for the cycle.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        <th className="p-4 pl-6">Employee</th>
                        <th className="p-4">Month</th>
                        <th className="p-4 text-right pr-6">Net Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {result.map((r: any) => (
                        <tr key={r.payrollId} className="hover:bg-zinc-900/40 transition duration-150 text-sm group">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-indigo-400 transition">
                                <IdentificationIcon className="w-4 h-4" />
                              </div>
                              <span className="font-semibold text-zinc-150 group-hover:text-white transition">
                                {r.employee?.fullName || `Employee #${r.employeeId}`}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-zinc-400 text-xs">
                            {dayjs(r.month).format("MMMM YYYY")}
                          </td>
                          <td className="p-4 pr-6 text-right font-mono font-bold text-emerald-400">
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
