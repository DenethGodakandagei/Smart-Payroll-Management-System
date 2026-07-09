"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "@/app/components/Sidebar";
import { Cog6ToothIcon, CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const [epf, setEpf] = useState<number>(8.0);
  const [etf, setEtf] = useState<number>(3.0);
  const [tax, setTax] = useState<number>(10.0);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/settings")
      .then(res => {
        setEpf(Number(res.data.epfPercent));
        setEtf(Number(res.data.etfPercent));
        setTax(Number(res.data.taxPercent));
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load current payroll configuration.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSuccess(null);
    setError(null);
    setSaving(true);
    try {
      await api.post("/settings", {
        epfPercent: epf,
        etfPercent: etf,
        taxPercent: tax
      });
      setSuccess("Payroll statutory rates successfully updated!");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || "Failed to update configuration settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex bg-[#f8f9fa] min-h-screen font-sans text-zinc-800">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        {/* Page Header */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">System Settings</h1>
            <p className="text-zinc-550 text-sm mt-1 font-medium">Configure corporate payroll contribution percentages and parameters.</p>
          </div>
        </div>

        {/* Content Box */}
        <div className="max-w-xl rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <Cog6ToothIcon className="w-5 h-5 text-[#2bd97b] stroke-[2]" />
            Deduction & Tax Rates
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-3 border-zinc-250 border-t-[#2bd97b] rounded-full animate-spin" />
              <span className="text-zinc-450 text-sm font-semibold">Loading system settings...</span>
            </div>
          ) : (
            <div className="space-y-6">
              
              {success && (
                <div className="flex gap-2.5 p-4 mb-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium animate-fade-in">
                  <CheckCircleIcon className="w-5 h-5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="flex gap-2.5 p-4 mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-650 text-sm font-medium animate-fade-in">
                  <InformationCircleIcon className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
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
                  className="w-full h-2 bg-zinc-150 rounded-lg appearance-none cursor-pointer accent-[#2bd97b]"
                />
                <div className="flex justify-between text-xxs text-zinc-400 font-bold">
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
                  className="w-full h-2 bg-zinc-150 rounded-lg appearance-none cursor-pointer accent-[#2bd97b]"
                />
                <div className="flex justify-between text-xxs text-zinc-400 font-bold">
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
                  className="w-full h-2 bg-zinc-150 rounded-lg appearance-none cursor-pointer accent-[#2bd97b]"
                />
                <div className="flex justify-between text-xxs text-zinc-400 font-bold">
                  <span>0%</span>
                  <span>15%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-sm rounded-full shadow-sm active:scale-[0.98] transition duration-150 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Apply Settings"
                )}
              </button>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
