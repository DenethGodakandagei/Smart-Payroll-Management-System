"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { Employee } from "../types";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import Sidebar from "@/app/components/Sidebar";
import { 
  CalendarIcon, 
  ClockIcon, 
  ClipboardDocumentCheckIcon, 
  CheckCircleIcon, 
  InformationCircleIcon, 
  IdentificationIcon 
} from "@heroicons/react/24/outline";

type Form = {
  employeeId: string;
  monthYear: string;
  workingHours: number;
  overtimeHours: number;
  unpaidLeaves: number;
};

type AttendanceLog = {
  attendanceId: number;
  employeeId: number;
  employee?: Employee;
  monthYear: string;
  workingHours: number;
  overtimeHours: number;
  unpaidLeaves: number;
};

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
    defaultValues: {
      employeeId: "",
      monthYear: dayjs().startOf("month").format("YYYY-MM-DD"),
      workingHours: 160,
      overtimeHours: 0,
      unpaidLeaves: 0,
    },
  });

  // Load employees and logs on mount
  const fetchData = async () => {
    try {
      const [empRes, logsRes] = await Promise.all([
        api.get("/employees"),
        api.get("/attendance")
      ]);
      setEmployees(empRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        employeeId: "",
        monthYear: dayjs().startOf("month").format("YYYY-MM-DD"),
        workingHours: 160,
        overtimeHours: 0,
        unpaidLeaves: 0,
      });
      
      // Refresh logs list
      const logsRes = await api.get("/attendance");
      setLogs(logsRes.data);
      
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
            <p className="text-zinc-550 text-sm mt-1 font-medium">Record and view monthly working hours and leaves for staff.</p>
          </div>
        </div>

        {/* Grid Panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Attendance Entry Column */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm h-fit">
              <h2 className="text-base font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <ClipboardDocumentCheckIcon className="w-5 h-5 text-[#2bd97b] stroke-[2]" />
                Add Attendance Entry
              </h2>

              {success && (
                <div className="flex gap-2.5 p-4 mb-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                  <CheckCircleIcon className="w-5 h-5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="flex gap-2.5 p-4 mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-650 text-xs font-semibold">
                  <InformationCircleIcon className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Employee Selection */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Select Employee</label>
                  <select
                    {...register("employeeId", { required: "Employee selection is required" })}
                    className={`w-full bg-zinc-50 border text-zinc-900 rounded-2xl px-4 py-3 text-sm focus:outline-none transition duration-200 ${errors.employeeId ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                  >
                    <option value="" className="bg-white">Choose staff member...</option>
                    {employees.map(e => (
                      <option key={e.employeeId} value={e.employeeId} className="bg-white">
                        {e.fullName} (ID: {e.employeeId})
                      </option>
                    ))}
                  </select>
                  {errors.employeeId && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.employeeId.message}</p>}
                </div>

                {/* Month/Year */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Target Month</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                      <CalendarIcon className="w-5 h-5" />
                    </span>
                    <input
                      {...register("monthYear", { required: "Date is required" })}
                      type="date"
                      className={`w-full bg-zinc-50 border text-zinc-900 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none transition duration-200 [color-scheme:light] ${errors.monthYear ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                  </div>
                  {errors.monthYear && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.monthYear.message}</p>}
                </div>

                {/* Working Hours */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Working Hours</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-450">
                      <ClockIcon className="w-4 h-4" />
                    </span>
                    <input
                      {...register("workingHours", { 
                        required: "Working hours required", 
                        valueAsNumber: true,
                        min: { value: 1, message: "Must be greater than 0" } 
                      })}
                      type="number"
                      placeholder="160"
                      className={`w-full bg-zinc-50 border text-zinc-900 placeholder-zinc-400 rounded-2xl pl-10 pr-3 py-3 text-sm focus:outline-none transition duration-200 ${errors.workingHours ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                  </div>
                  {errors.workingHours && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.workingHours.message}</p>}
                </div>

                {/* Overtime Hours */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Overtime Hours</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-455">
                      <ClockIcon className="w-4 h-4" />
                    </span>
                    <input
                      {...register("overtimeHours", { 
                        required: "Overtime hours required", 
                        valueAsNumber: true,
                        min: { value: 0, message: "Cannot be negative" }
                      })}
                      type="number"
                      placeholder="0"
                      className={`w-full bg-zinc-50 border text-zinc-900 placeholder-zinc-400 rounded-2xl pl-10 pr-3 py-3 text-sm focus:outline-none transition duration-200 ${errors.overtimeHours ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                  </div>
                  {errors.overtimeHours && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.overtimeHours.message}</p>}
                </div>

                {/* Unpaid Leaves */}
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Unpaid Leaves</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-455">
                      <ClockIcon className="w-4 h-4" />
                    </span>
                    <input
                      {...register("unpaidLeaves", { 
                        required: "Leaves count required", 
                        valueAsNumber: true,
                        min: { value: 0, message: "Cannot be negative" }
                      })}
                      type="number"
                      placeholder="0"
                      className={`w-full bg-zinc-50 border text-zinc-900 placeholder-zinc-400 rounded-2xl pl-10 pr-3 py-3 text-sm focus:outline-none transition duration-200 ${errors.unpaidLeaves ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                  </div>
                  {errors.unpaidLeaves && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.unpaidLeaves.message}</p>}
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
          </div>

          {/* Attendance History Column */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-zinc-200/80 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-zinc-200/80 bg-zinc-50/50">
                <h3 className="text-sm font-bold text-zinc-500">Attendance History Logs</h3>
              </div>

              {loadingLogs ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-3 border-zinc-250 border-t-[#2bd97b] rounded-full animate-spin" />
                  <span className="text-zinc-450 text-sm font-semibold">Retrieving attendance timeline...</span>
                </div>
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <IdentificationIcon className="w-12 h-12 text-zinc-400 mb-3" />
                  <h4 className="text-zinc-800 font-bold text-sm">No Attendance Logged</h4>
                  <p className="text-zinc-550 text-xs mt-1 max-w-xs font-semibold">
                    Submit logs on the left panel to build the attendance history list.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200/80 bg-zinc-50/50 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <th className="p-4 pl-6">Employee</th>
                        <th className="p-4">Target Month</th>
                        <th className="p-4 text-center">Working Hours</th>
                        <th className="p-4 text-center">Overtime Hours</th>
                        <th className="p-4 text-center">Unpaid Leaves</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {logs.map((log) => (
                        <tr key={log.attendanceId} className="hover:bg-zinc-50/50 transition duration-150 text-sm group">
                          <td className="p-4 pl-6">
                            <div className="font-bold text-zinc-900 group-hover:text-black transition">
                              {log.employee?.fullName || `Employee #${log.employeeId}`}
                            </div>
                            <div className="text-xs text-zinc-500 font-semibold mt-0.5">{log.employee?.email}</div>
                          </td>
                          <td className="p-4 font-mono text-zinc-500 text-xs font-semibold">
                            {dayjs(log.monthYear).format("MMMM YYYY")}
                          </td>
                          <td className="p-4 text-center font-mono font-bold text-zinc-800">
                            {log.workingHours} hrs
                          </td>
                          <td className="p-4 text-center">
                            {log.overtimeHours > 0 ? (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 font-mono">
                                +{log.overtimeHours} hrs
                              </span>
                            ) : (
                              <span className="text-zinc-400 font-mono text-xs">0 hrs</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {log.unpaidLeaves > 0 ? (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 border border-red-100 text-red-650 font-mono">
                                {log.unpaidLeaves} days
                              </span>
                            ) : (
                              <span className="text-zinc-400 font-mono text-xs">0 days</span>
                            )}
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
