"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { Employee } from "../types";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import Sidebar from "@/app/components/Sidebar";
import { CalendarIcon, ClockIcon, ClipboardDocumentCheckIcon, CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

type Form = {
  employeeId: number;
  monthYear: string;
  workingHours: number;
  overtimeHours: number;
  unpaidLeaves: number;
};

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<Form>({
    defaultValues: {
      monthYear: dayjs().startOf("month").format("YYYY-MM-DD"),
      workingHours: 160,
      overtimeHours: 0,
      unpaidLeaves: 0,
    },
  });

  useEffect(() => {
    api.get("/employees")
      .then(r => setEmployees(r.data))
      .catch(() => {});
  }, []);

  const onSubmit = async (d: Form) => {
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      const payload = {
        ...d,
        employeeId: Number(d.employeeId),
        workingHours: Number(d.workingHours),
        overtimeHours: Number(d.overtimeHours),
        unpaidLeaves: Number(d.unpaidLeaves),
      };
      await api.post("/attendance", payload);
      setSuccess("Attendance record has been successfully saved to the system!");
      reset({
        monthYear: dayjs().startOf("month").format("YYYY-MM-DD"),
        workingHours: 160,
        overtimeHours: 0,
        unpaidLeaves: 0,
      });
      // Clear success banner after 4 seconds
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || "Failed to record attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#f8f9fa] min-h-screen font-sans text-zinc-800">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">Attendance Logs</h1>
            <p className="text-zinc-500 text-sm mt-1 font-medium">Record and edit monthly working hours and leaves for staff.</p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="max-w-xl rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="w-5 h-5 text-[#2bd97b] stroke-[2]" />
            Add Attendance Entry
          </h2>

          {success && (
            <div className="flex gap-2.5 p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm animate-fade-in font-medium">
              <CheckCircleIcon className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="flex gap-2.5 p-4 mb-6 rounded-2xl bg-red-50 border border-red-100 text-red-650 text-sm animate-fade-in font-medium">
              <InformationCircleIcon className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Employee Selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Select Employee</label>
              <select
                {...register("employeeId", { required: true })}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
              >
                <option value="" className="bg-white">Choose staff member...</option>
                {employees.map(e => (
                  <option key={e.employeeId} value={e.employeeId} className="bg-white">
                    {e.fullName} (ID: {e.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Month/Year */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Target Month</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                  <CalendarIcon className="w-5 h-5" />
                </span>
                <input
                  {...register("monthYear", { required: true })}
                  type="date"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-250 [color-scheme:light]"
                />
              </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Working Hours */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Working Hours</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <ClockIcon className="w-4 h-4" />
                  </span>
                  <input
                    {...register("workingHours", { required: true, valueAsNumber: true })}
                    type="number"
                    placeholder="160"
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                  />
                </div>
              </div>

              {/* Overtime Hours */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Overtime Hours</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <ClockIcon className="w-4 h-4" />
                  </span>
                  <input
                    {...register("overtimeHours", { required: true, valueAsNumber: true })}
                    type="number"
                    placeholder="0"
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                  />
                </div>
              </div>

              {/* Unpaid Leaves */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Unpaid Leaves</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <ClockIcon className="w-4 h-4" />
                  </span>
                  <input
                    {...register("unpaidLeaves", { required: true, valueAsNumber: true })}
                    type="number"
                    placeholder="0"
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-sm rounded-full shadow-sm active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Save Attendance Log"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
