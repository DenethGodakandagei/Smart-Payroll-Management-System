// pages/employees/create.tsx
import { useForm } from "react-hook-form";
import api from "../../lib/api";
import { useRouter } from "next/router";
import dayjs from "dayjs";

type Form = {
  fullName: string;
  email: string;
  password: string;
  designation?: string;
  basicSalary?: number;
  bankAccountNo?: string;
  joiningDate?: string;
  roleId?: number;
};

export default function CreateEmployee() {
  const { register, handleSubmit } = useForm<Form>({ defaultValues: { joiningDate: dayjs().format("YYYY-MM-DD") }});
  const router = useRouter();

  const onSubmit = async (data: Form) => {
    await api.post("/auth/register", data);
    router.push("/employees");
  };

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-lg font-medium mb-4">Create Employee</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("fullName")} placeholder="Full name" className="w-full border p-2 rounded" />
        <input {...register("email")} placeholder="Email" className="w-full border p-2 rounded" />
        <input {...register("password")} placeholder="Password" className="w-full border p-2 rounded" />
        <input {...register("designation")} placeholder="Designation" className="w-full border p-2 rounded" />
        <input {...register("basicSalary")} type="number" placeholder="Basic Salary" className="w-full border p-2 rounded" />
        <input {...register("bankAccountNo")} placeholder="Bank Account No" className="w-full border p-2 rounded" />
        <input {...register("joiningDate")} type="date" className="w-full border p-2 rounded" />
        <input {...register("roleId")} type="number" placeholder="RoleId (e.g. 1 Admin, 2 HR)" className="w-full border p-2 rounded" />
        <button className="w-full bg-green-600 text-white p-2 rounded">Create</button>
      </form>
    </div>
  );
}
