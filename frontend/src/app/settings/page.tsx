"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "@/app/components/Sidebar";
import dayjs from "dayjs";
import { Cog6ToothIcon, CheckCircleIcon, InformationCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

type AuditLogItem = {
  logId: number;
  tableName: string;
  recordId: string;
  fieldChanged: string; // Method (POST, PUT, DELETE)
  oldValue: string;
  newValue: string;
  timestamp: string;
  changedBy: string;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"rates" | "audit">("rates");
  
  // Tab 1: Rates State
  const [epf, setEpf] = useState<number>(8.0);
  const [etf, setEtf] = useState<number>(3.0);
  const [tax, setTax] = useState<number>(10.0);
  const [loadingRates, setLoadingRates] = useState(true);
  const [savingRates, setSavingRates] = useState(false);
  const [successRates, setSuccessRates] = useState<string | null>(null);
  const [errorRates, setErrorRates] = useState<string | null>(null);

  // Tab 2: Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [errorAudit, setErrorAudit] = useState<string | null>(null);

  // Load current rates on mount
  useEffect(() => {
    api.get("/settings")
      .then(res => {
        setEpf(Number(res.data.epfPercent));
        setEtf(Number(res.data.etfPercent));
        setTax(Number(res.data.taxPercent));
      })
      .catch(err => {
        console.error(err);
        setErrorRates("Failed to load current payroll configuration.");
      })
      .finally(() => {
        setLoadingRates(false);
      });
  }, []);

  // Fetch audit logs when tab is selected
  const fetchAuditLogs = () => {
    setLoadingAudit(true);
    setErrorAudit(null);
    api.get("/audit")
      .then(res => {
        setAuditLogs(res.data);
      })
      .catch(err => {
        console.error(err);
        setErrorAudit("Failed to retrieve system audit logs.");
      })
      .finally(() => {
        setLoadingAudit(false);
      });
  };

  useEffect(() => {
    if (activeTab === "audit") {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const handleSaveRates = async () => {
    setSuccessRates(null);
    setErrorRates(null);
    setSavingRates(true);
    try {
      await api.post("/settings", {
        epfPercent: epf,
        etfPercent: etf,
        taxPercent: tax
      });
      setSuccessRates("Payroll statutory rates successfully updated!");
      setTimeout(() => setSuccessRates(null), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorRates(err.response?.data || "Failed to update configuration settings.");
    } finally {
      setSavingRates(false);
    }
  };

  return (
    <div className="flex bg-[#f8f9fa] min-h-screen font-sans text-zinc-800">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        {/* Page Header */}
        <div className="flex justify-between items-center mb-6 border-b border-zinc-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">System Settings</h1>
            <p className="text-zinc-550 text-sm mt-1 font-medium">Configure corporate payroll parameters and monitor administrative logs.</p>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-zinc-200 mb-8 max-w-4xl">
          <button
            onClick={() => setActiveTab("rates")}
            className={`px-6 py-3 border-b-2 text-sm font-bold transition duration-150 ${
              activeTab === "rates"
                ? "border-zinc-950 text-zinc-950"
                : "border-transparent text-zinc-450 hover:text-zinc-700"
            }`}
          >
            Statutory Deduction Rates
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-6 py-3 border-b-2 text-sm font-bold transition duration-150 ${
              activeTab === "audit"
                ? "border-zinc-950 text-zinc-950"
                : "border-transparent text-zinc-450 hover:text-zinc-700"
            }`}
          >
            System Audit Logs
          </button>
        </div>

        {/* Content Box */}
        <div className="max-w-4xl rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
          
          {/* Rates Tab */}
          {activeTab === "rates" && (
            <div className="max-w-xl">
              <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5 text-[#2bd97b] stroke-[2]" />
                Statutory Deductions & Taxes
              </h2>

              {loadingRates ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-3 border-zinc-250 border-t-[#2bd97b] rounded-full animate-spin" />
                  <span className="text-zinc-450 text-sm font-semibold">Loading system settings...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {successRates && (
                    <div className="flex gap-2.5 p-4 mb-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium">
                      <CheckCircleIcon className="w-5 h-5 shrink-0" />
                      <span>{successRates}</span>
                    </div>
                  )}

                  {errorRates && (
                    <div className="flex gap-2.5 p-4 mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-650 text-sm font-medium">
                      <InformationCircleIcon className="w-5 h-5 shrink-0" />
                      <span>{errorRates}</span>
                    </div>
                  )}

                  {/* EPF Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold text-zinc-700">
                      <span>EPF Rate (Employee contribution)</span>
                      <span className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-950 font-mono">
                        {epf.toFixed(1)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={epf}
                      onChange={(e) => setEpf(parseFloat(e.target.value))}
                      className="w-full h-2 bg-zinc-150 rounded-lg cursor-pointer accent-[#2bd97b]"
                    />
                    <div className="flex justify-between text-xxs text-zinc-450 font-bold">
                      <span>0%</span>
                      <span>10%</span>
                      <span>20%</span>
                    </div>
                  </div>

                  {/* ETF Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold text-zinc-700">
                      <span>ETF Rate</span>
                      <span className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-950 font-mono">
                        {etf.toFixed(1)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={etf}
                      onChange={(e) => setEtf(parseFloat(e.target.value))}
                      className="w-full h-2 bg-zinc-150 rounded-lg cursor-pointer accent-[#2bd97b]"
                    />
                    <div className="flex justify-between text-xxs text-zinc-450 font-bold">
                      <span>0%</span>
                      <span>5%</span>
                      <span>10%</span>
                    </div>
                  </div>

                  {/* Tax Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold text-zinc-700">
                      <span>Income Tax Rate</span>
                      <span className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-950 font-mono">
                        {tax.toFixed(1)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="0.5"
                      value={tax}
                      onChange={(e) => setTax(parseFloat(e.target.value))}
                      className="w-full h-2 bg-zinc-150 rounded-lg cursor-pointer accent-[#2bd97b]"
                    />
                    <div className="flex justify-between text-xxs text-zinc-450 font-bold">
                      <span>0%</span>
                      <span>15%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveRates}
                    disabled={savingRates}
                    className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-sm rounded-full shadow-sm active:scale-[0.98] transition duration-150 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                  >
                    {savingRates ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Apply Settings"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === "audit" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-[#2bd97b] stroke-[2]" />
                  Administrative Audit Logs
                </h2>
                <button
                  onClick={fetchAuditLogs}
                  className="px-4 py-1.5 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-full text-xs font-bold text-zinc-600 transition shadow-sm"
                >
                  Refresh Logs
                </button>
              </div>

              {loadingAudit ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-3 border-zinc-250 border-t-[#2bd97b] rounded-full animate-spin" />
                  <span className="text-zinc-450 text-sm font-semibold">Retrieving audit timeline...</span>
                </div>
              ) : errorAudit ? (
                <div className="flex gap-2.5 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-650 text-sm font-medium">
                  <InformationCircleIcon className="w-5 h-5 shrink-0" />
                  <span>{errorAudit}</span>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-16">
                  <ClockIcon className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                  <h3 className="text-zinc-800 font-bold text-sm">No Audit Logs</h3>
                  <p className="text-zinc-500 text-xs mt-1 font-medium">Any data modifications will be recorded and logged here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <th className="p-3 pl-4">Timestamp</th>
                        <th className="p-3">Action Type</th>
                        <th className="p-3">Resource Route</th>
                        <th className="p-3 pr-4 text-right">Executor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-150 text-xs font-semibold">
                      {auditLogs.map((log) => {
                        const isPost = log.fieldChanged === "POST";
                        const isDelete = log.fieldChanged === "DELETE";
                        return (
                          <tr key={log.logId} className="hover:bg-zinc-50/50 transition">
                            <td className="p-3 pl-4 text-zinc-500 font-mono">
                              {dayjs(log.timestamp).format("DD MMM YYYY, hh:mm A")}
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                isPost
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : isDelete
                                    ? "bg-red-50 text-red-700 border border-red-100"
                                    : "bg-blue-50 text-blue-700 border border-blue-100"
                              }`}>
                                {log.fieldChanged === "POST" ? "CREATED" : log.fieldChanged === "PUT" ? "UPDATED" : "DELETED"}
                              </span>
                            </td>
                            <td className="p-3 text-zinc-850 font-mono max-w-[200px] truncate">
                              {log.tableName}
                            </td>
                            <td className="p-3 pr-4 text-right text-zinc-950 font-bold">
                              {log.changedBy}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
