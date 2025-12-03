"use client";

import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

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
      roleId: 1,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: Form) => {
    try {
      const payload = {
        ...data,
        basicSalary: Number(data.basicSalary), // ensure decimal
        roleId: Number(data.roleId), // ensure integer
      };

      console.log("Submitting payload:", payload);

      await api.post("/auth/register", payload);
      reset();
      router.push("/employees");
    } catch (error: any) {
      console.error("Backend error:", error.response?.data || error.message);
      alert(
        "Failed to create employee: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow mx-auto mt-10">
      <h2 className="text-lg font-medium mb-4">Create Employee</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...register("fullName", { required: true })}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("email", { required: true })}
          placeholder="Email"
          type="email"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("password", { required: true })}
          placeholder="Password"
          type="password"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("nic", { required: true })}
          placeholder="NIC"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("memberNo", { required: true })}
          placeholder="Member No"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("designation")}
          placeholder="Designation"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("basicSalary", { valueAsNumber: true })}
          type="number"
          placeholder="Basic Salary"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("bankAccountNo")}
          placeholder="Bank Account No"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("joiningDate")}
          type="date"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("roleId", { valueAsNumber: true })}
          type="number"
          placeholder="RoleId (e.g., 1 Admin, 2 HR)"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Create
        </button>
      </form>
    </div>
  );
}
