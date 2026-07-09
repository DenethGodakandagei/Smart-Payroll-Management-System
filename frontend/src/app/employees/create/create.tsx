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
    <div className="flex bg-[#f8f9fa] min-h-screen font-sans text-zinc-800">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-zinc-200 pb-5">
          <button
            onClick={() => router.push("/employees")}
            className="p-2.5 rounded-full border border-zinc-200 bg-white text-zinc-550 hover:text-zinc-900 hover:bg-zinc-50 transition duration-150 shadow-sm"
          >
            <ArrowLeftIcon className="w-5 h-5 stroke-[2]" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">Add New Employee</h1>
            <p className="text-zinc-500 text-sm mt-1 font-medium">Register a new staff member to the payroll database.</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
          {error && (
            <div className="flex gap-2 p-4 mb-6 rounded-2xl bg-red-50 border border-red-100 text-red-650 text-sm font-medium">
              <InformationCircleIcon className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  {...register("fullName", { required: true })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                />
              </div>

              {/* Member No */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Member Number</label>
                <input
                  {...register("memberNo", { required: true })}
                  placeholder="e.g. SPM-025"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="john.doe@smartpayroll.com"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Password</label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                />
              </div>

              {/* NIC */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">National Identity Card (NIC)</label>
                <input
                  {...register("nic", { required: true })}
                  placeholder="e.g. 199512345678"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Designation / Role Title</label>
                <input
                  {...register("designation")}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                />
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Basic Salary (LKR)</label>
                <input
                  {...register("basicSalary", { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 75000"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                />
              </div>

              {/* Bank Account No */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Bank Account Number</label>
                <input
                  {...register("bankAccountNo")}
                  placeholder="e.g. 8012345678"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                />
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Joining Date</label>
                <input
                  {...register("joiningDate")}
                  type="date"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200 [color-scheme:light]"
                />
              </div>

              {/* Role ID Dropdown */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">System Permission Role</label>
                <select
                  {...register("roleId", { valueAsNumber: true })}
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 focus:bg-white transition duration-200"
                >
                  <option value={1} className="bg-white">Admin</option>
                  <option value={2} className="bg-white">HR Manager</option>
                  <option value={3} className="bg-white">Employee</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-sm rounded-full shadow-sm active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlusIcon className="w-5 h-5 stroke-[2]" />
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
