"use client";

import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { ArrowLeftIcon, UserPlusIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

type Form = {
  fullName: string;
  email: string;
  password: string;
  nic: string;
  memberNo: string;
  designation?: string;
  basicSalary: number;
  bankAccountNo?: string;
  joiningDate: string;
  roleId: number;
};

export default function CreateEmployee() {
  const { register, handleSubmit, reset } = useForm<Form>({
    defaultValues: {
      joiningDate: dayjs().format("YYYY-MM-DD"),
      basicSalary: 0,
      roleId: 3, // Default to Employee role
    },
  });

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: Form) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        ...data,
        basicSalary: Number(data.basicSalary),
        roleId: Number(data.roleId),
      };

      await api.post("/auth/register", payload);
      reset();
      router.push("/employees");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || err.response?.data?.message || "Failed to create employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-zinc-950 min-h-screen font-sans text-zinc-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-zinc-900 pb-5">
          <button
            onClick={() => router.push("/employees")}
            className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition duration-150"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Add New Employee</h1>
            <p className="text-zinc-400 text-sm mt-1">Register a new staff member to the payroll database.</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md p-8 shadow-xl">
          {error && (
            <div className="flex gap-2 p-4 mb-6 rounded-2xl bg-red-950/20 border border-red-900/30 text-red-400 text-sm">
              <InformationCircleIcon className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  {...register("fullName", { required: true })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 placeholder-zinc-650 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                />
              </div>

              {/* Member No */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Member Number</label>
                <input
                  {...register("memberNo", { required: true })}
                  placeholder="e.g. SPM-025"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 placeholder-zinc-650 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="john.doe@smartpayroll.com"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 placeholder-zinc-650 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 placeholder-zinc-650 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                />
              </div>

              {/* NIC */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">National Identity Card (NIC)</label>
                <input
                  {...register("nic", { required: true })}
                  placeholder="e.g. 199512345678"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 placeholder-zinc-650 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Designation / Role Title</label>
                <input
                  {...register("designation")}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 placeholder-zinc-650 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                />
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Basic Salary (LKR)</label>
                <input
                  {...register("basicSalary", { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 75000"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 placeholder-zinc-650 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                />
              </div>

              {/* Bank Account No */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Bank Account Number</label>
                <input
                  {...register("bankAccountNo")}
                  placeholder="e.g. 8012345678"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 placeholder-zinc-650 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                />
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Joining Date</label>
                <input
                  {...register("joiningDate")}
                  type="date"
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-250 [color-scheme:dark]"
                />
              </div>

              {/* Role ID Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">System Permission Role</label>
                <select
                  {...register("roleId", { valueAsNumber: true })}
                  className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                >
                  <option value={1} className="bg-zinc-900">Admin</option>
                  <option value={2} className="bg-zinc-900">HR Manager</option>
                  <option value={3} className="bg-zinc-900">Employee</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlusIcon className="w-5 h-5" />
                  Register Employee
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
