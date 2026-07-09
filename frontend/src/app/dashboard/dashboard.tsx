"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "@/app/components/Sidebar";
import { UserGroupIcon, CurrencyDollarIcon, PresentationChartLineIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline";

type TrendItem = {
  month: string;
  totalNet: number;
  totalGross: number;
};

type StatsData = {
  activeEmployees: number;
  latestCycle: string;
  breakdown: {
    epf: number;
    etf: number;
    tax: number;
    net: number;
  };
  trend: TrendItem[];
};

export default function Dashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/dashboard/stats")
      .then(res => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard metrics.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compute total statutory deductions
  const totalDeductions = stats ? (stats.breakdown.epf + stats.breakdown.etf + stats.breakdown.tax) : 0;
  const totalGrossCycle = stats ? (stats.breakdown.net + totalDeductions) : 0;

  // Chart coordinate calculations
  const trend = stats?.trend || [];
  const maxVal = Math.max(...trend.map(t => Math.max(t.totalNet, t.totalGross, 100000)));

  // Generate SVG points
  const pointsNet = trend.map((t, i) => {
    const x = 50 + i * 80;
    const y = 180 - (t.totalNet / maxVal) * 140;
    return { x, y };
  });

  const pointsGross = trend.map((t, i) => {
    const x = 50 + i * 80;
    const y = 180 - (t.totalGross / maxVal) * 140;
    return { x, y };
  });

  const linePathNet = pointsNet.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPathNet = pointsNet.length > 0 ? `${linePathNet} L ${pointsNet[pointsNet.length - 1].x} 180 L ${pointsNet[0].x} 180 Z` : "";

  const linePathGross = pointsGross.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Pie chart calculation helper
  const epfRatio = totalGrossCycle > 0 ? (stats!.breakdown.epf / totalGrossCycle) : 0;
  const etfRatio = totalGrossCycle > 0 ? (stats!.breakdown.etf / totalGrossCycle) : 0;
  const taxRatio = totalGrossCycle > 0 ? (stats!.breakdown.tax / totalGrossCycle) : 0;
  const netRatio = totalGrossCycle > 0 ? (stats!.breakdown.net / totalGrossCycle) : 0;

  return (
    <div className="flex bg-[#f8f9fa] min-h-screen font-sans text-zinc-800">
      <Sidebar />
      
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* Mockup-style Greetings Header */}
        <div className="mb-10 flex justify-between items-end border-b border-zinc-200 pb-5">
          <div>
            <span className="text-zinc-400 text-sm font-semibold tracking-wide uppercase">SmartPayroll Dashboard</span>
            <h1 className="text-4xl font-extrabold text-zinc-950 tracking-tight mt-1">Welcome Back, Deneth Lakmal.</h1>
          </div>
          {stats?.latestCycle && (
            <div className="text-right text-xs font-bold text-zinc-500 uppercase tracking-widest print:hidden">
              Payroll Cycle: <span className="text-zinc-900 font-extrabold">{stats.latestCycle}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-3">
            <div className="w-8 h-8 border-3 border-zinc-250 border-t-[#2bd97b] rounded-full animate-spin" />
            <span className="text-zinc-450 text-sm font-semibold">Gathering corporate insights...</span>
          </div>
        ) : error || !stats ? (
          <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm">
            <ShieldExclamationIcon className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-zinc-800">Metrics Unobtainable</h2>
            <p className="text-zinc-550 text-xs mt-1 mb-4 font-semibold">{error || "Ensure your backend C# endpoints are up."}</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Active Employees */}
              <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-sm flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-extrabold uppercase text-zinc-450 tracking-wider">Active Employees</span>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-700 shadow-sm">
                    <UserGroupIcon className="w-5 h-5 text-zinc-800" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-zinc-950 tracking-tight leading-none block mb-1">
                    {stats.activeEmployees}
                  </span>
                  <span className="text-xs text-zinc-450 font-semibold">Registered staff members</span>
                </div>
              </div>

              {/* Net Payout */}
              <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-sm flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-extrabold uppercase text-zinc-450 tracking-wider">Latest Net Salary Payout</span>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-700 shadow-sm">
                    <CurrencyDollarIcon className="w-5 h-5 text-zinc-800" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-emerald-650 tracking-tight leading-none block mb-1 font-mono">
                    LKR {stats.breakdown.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-zinc-450 font-semibold">Net salary payout for {stats.latestCycle}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="p-6 rounded-3xl bg-white border border-zinc-200/80 shadow-sm flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-extrabold uppercase text-zinc-450 tracking-wider">Statutory Deductions</span>
                  <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-700 shadow-sm">
                    <PresentationChartLineIcon className="w-5 h-5 text-zinc-800" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-red-650 tracking-tight leading-none block mb-1 font-mono">
                    LKR {totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-zinc-450 font-semibold">Tax, EPF, and ETF cycle totals</span>
                </div>
              </div>
            </div>

            {/* Graphics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Salary Expense Trend Line/Area Chart */}
              <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-zinc-900">Salary Expenditure Trend</h3>
                  <div className="flex items-center gap-4 text-xxs font-bold text-zinc-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 bg-zinc-300 border border-zinc-400 rounded-full" />
                      <span>Gross Payout</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 bg-[#2bd97b] rounded-full" />
                      <span>Net Payout</span>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <svg className="w-full h-64 overflow-visible" viewBox="0 0 480 220">
                    <defs>
                      <linearGradient id="chart-net-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2bd97b" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2bd97b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Y-Axis Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => (
                      <line
                        key={idx}
                        x1="35"
                        y1={180 - r * 140}
                        x2="455"
                        y2={180 - r * 140}
                        stroke="#f1f5f9"
                        strokeWidth="1.5"
                      />
                    ))}

                    {/* Y-Axis Labels */}
                    {[0, 0.5, 1].map((r, idx) => (
                      <text
                        key={idx}
                        x="30"
                        y={184 - r * 140}
                        className="text-[9px] font-bold text-zinc-400 font-mono text-right"
                        textAnchor="end"
                      >
                        {( (maxVal * r) / 1000 ).toFixed(0)}k
                      </text>
                    ))}

                    {/* X-Axis Labels */}
                    {trend.map((t, idx) => (
                      <text
                        key={idx}
                        x={50 + idx * 80}
                        y="204"
                        className="text-[9px] font-bold text-zinc-400 font-sans"
                        textAnchor="middle"
                      >
                        {t.month}
                      </text>
                    ))}

                    {/* Gradient Area Payout */}
                    {areaPathNet && (
                      <path d={areaPathNet} fill="url(#chart-net-grad)" />
                    )}

                    {/* Gross line */}
                    {linePathGross && (
                      <path
                        d={linePathGross}
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    )}

                    {/* Net Line */}
                    {linePathNet && (
                      <path
                        d={linePathNet}
                        fill="none"
                        stroke="#2bd97b"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Active Point Nodes */}
                    {pointsNet.map((p, idx) => (
                      <g key={idx}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="6"
                          className="fill-white stroke-[#2bd97b] stroke-[3.5] cursor-pointer hover:r-[7] transition-all"
                        />
                        <text
                          x={p.x}
                          y={p.y - 12}
                          className="text-[9px] font-bold font-mono text-zinc-800 fill-zinc-850"
                          textAnchor="middle"
                        >
                          LKR {Math.round(trend[idx].totalNet / 1000)}k
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Statutory Breakdown Visual Card */}
              <div className="lg:col-span-1 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 mb-4">Statutory Shares ({stats.latestCycle})</h3>
                  
                  {totalGrossCycle === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <span className="text-zinc-400 text-xs font-semibold">No transactions registered in this cycle.</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Net Salary Share */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1 text-zinc-700">
                          <span>Net Salary Payout</span>
                          <span className="text-zinc-950">{(netRatio * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2bd97b] rounded-full transition-all duration-500" style={{ width: `${netRatio * 100}%` }} />
                        </div>
                      </div>

                      {/* Tax Share */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1 text-zinc-700">
                          <span>Income Tax Deductions</span>
                          <span className="text-zinc-950">{(taxRatio * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-550 rounded-full transition-all duration-500" style={{ width: `${taxRatio * 100}%` }} />
                        </div>
                      </div>

                      {/* EPF Share */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1 text-zinc-700">
                          <span>EPF Deductions</span>
                          <span className="text-zinc-950">{(epfRatio * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-550 rounded-full transition-all duration-500" style={{ width: `${epfRatio * 100}%` }} />
                        </div>
                      </div>

                      {/* ETF Share */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1 text-zinc-700">
                          <span>ETF Deductions</span>
                          <span className="text-zinc-950">{(etfRatio * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-550 rounded-full transition-all duration-500" style={{ width: `${etfRatio * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-100 text-xxs font-bold text-zinc-450 leading-relaxed uppercase mt-6">
                  Cycle Gross: <span className="font-mono text-zinc-800 text-[11px] font-extrabold block">LKR {totalGrossCycle.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
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
          </>
        )}

      </main>
    </div>
  );
}
