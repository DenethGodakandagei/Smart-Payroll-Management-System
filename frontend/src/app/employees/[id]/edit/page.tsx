"use client";

import { useForm } from "react-hook-form";
import api from "../../../lib/api";
import { useRouter, useParams } from "next/navigation";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { ArrowLeftIcon, CheckIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

type Form = {
  fullName: string;
  email: string;
  nic: string;
  memberNo: string;
  designation?: string;
  basicSalary: number;
  bankAccountNo?: string;
  joiningDate: string;
  roleId: number;
};

export default function EditEmployee() {
  const params = useParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
    defaultValues: {
      joiningDate: dayjs().format("YYYY-MM-DD"),
      basicSalary: 0,
      roleId: 3,
    },
  });

  useEffect(() => {
    if (!params?.id) return;
    api.get(`/employees/${params.id}`)
      .then(res => {
        const emp = res.data;
        reset({
          fullName: emp.fullName,
          email: emp.email,
          nic: emp.nic,
          memberNo: emp.memberNo,
          designation: emp.designation,
          basicSalary: emp.basicSalary,
          bankAccountNo: emp.bankAccountNo,
          joiningDate: dayjs(emp.joiningDate).format("YYYY-MM-DD"),
          roleId: emp.roleId,
        });
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load employee details.");
      })
      .finally(() => {
        setFetching(false);
      });
  }, [params?.id, reset]);

  const onSubmit = async (data: Form) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        ...data,
        basicSalary: Number(data.basicSalary),
        roleId: Number(data.roleId),
      };

      await api.put(`/employees/${params.id}`, payload);
      router.push("/employees");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || err.response?.data?.message || "Failed to update employee details.");
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
            className="p-2.5 rounded-full border border-zinc-200 bg-white text-zinc-555 hover:text-zinc-900 hover:bg-zinc-50 transition duration-150 shadow-sm"
          >
            <ArrowLeftIcon className="w-5 h-5 stroke-[2]" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">Edit Employee</h1>
            <p className="text-zinc-550 text-sm mt-1 font-medium">Update employee profile details, permissions, and base compensation.</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
          {fetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-3 border-zinc-250 border-t-[#2bd97b] rounded-full animate-spin" />
              <span className="text-zinc-450 text-sm font-semibold">Retrieving employee details...</span>
            </div>
          ) : (
            <>
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
                      {...register("fullName", { 
                        required: "Full name is required",
                        minLength: { value: 3, message: "Name must be at least 3 characters" }
                      })}
                      placeholder="e.g. John Doe"
                      className={`w-full bg-zinc-50 border text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none transition duration-200 ${errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.fullName.message}</p>}
                  </div>

                  {/* Member No */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Member Number</label>
                    <input
                      {...register("memberNo", { 
                        required: "Member number is required"
                      })}
                      placeholder="e.g. SPM-025"
                      className={`w-full bg-zinc-50 border text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none transition duration-200 ${errors.memberNo ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                    {errors.memberNo && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.memberNo.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Please enter a valid email address" }
                      })}
                      type="email"
                      placeholder="john.doe@smartpayroll.com"
                      className={`w-full bg-zinc-50 border text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none transition duration-200 ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
                  </div>

                  {/* NIC */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">National Identity Card (NIC)</label>
                    <input
                      {...register("nic", { 
                        required: "NIC is required",
                        pattern: { value: /^([0-9]{9}[vVxX]|[0-9]{12})$/, message: "Enter a valid NIC (e.g., 957654321V or 200322912427)" }
                      })}
                      placeholder="e.g. 199512345678"
                      className={`w-full bg-zinc-50 border text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none transition duration-200 ${errors.nic ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                    {errors.nic && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.nic.message}</p>}
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Designation / Role Title</label>
                    <input
                      {...register("designation", {
                        required: "Designation is required"
                      })}
                      placeholder="e.g. Software Engineer"
                      className={`w-full bg-zinc-50 border text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none transition duration-200 ${errors.designation ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                    {errors.designation && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.designation.message}</p>}
                  </div>

                  {/* Basic Salary */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Basic Salary (LKR)</label>
                    <input
                      {...register("basicSalary", { 
                        required: "Basic salary is required",
                        valueAsNumber: true,
                        min: { value: 1, message: "Salary must be greater than 0" }
                      })}
                      type="number"
                      placeholder="e.g. 75000"
                      className={`w-full bg-zinc-50 border text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none transition duration-200 ${errors.basicSalary ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                    {errors.basicSalary && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.basicSalary.message}</p>}
                  </div>

                  {/* Bank Account No */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Bank Account Number</label>
                    <input
                      {...register("bankAccountNo", {
                        required: "Bank account is required",
                        minLength: { value: 8, message: "Account number must be at least 8 digits" }
                      })}
                      placeholder="e.g. 8012345678"
                      className={`w-full bg-zinc-50 border text-zinc-900 placeholder-zinc-400 rounded-2xl px-4 py-3 text-sm focus:outline-none transition duration-200 ${errors.bankAccountNo ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                    {errors.bankAccountNo && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.bankAccountNo.message}</p>}
                  </div>

                  {/* Joining Date */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Joining Date</label>
                    <input
                      {...register("joiningDate", {
                        required: "Joining date is required"
                      })}
                      type="date"
                      className={`w-full bg-zinc-50 border text-zinc-900 rounded-2xl px-4 py-3 text-sm focus:outline-none transition duration-200 [color-scheme:light] ${errors.joiningDate ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-400 focus:bg-white'}`}
                    />
                    {errors.joiningDate && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.joiningDate.message}</p>}
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
                      <CheckIcon className="w-5 h-5 stroke-[2.5]" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
