// pages/attendance/index.tsx
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Employee } from "../../types";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

type Form = {
  employeeId: number;
  monthYear: string;
  workingHours: number;
  overtimeHours: number;
  unpaidLeaves: number;
};

export default function AttendancePage(){
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { register, handleSubmit, reset } = useForm<Form>({ defaultValues: { monthYear: dayjs().startOf('month').format('YYYY-MM-DD')}});
  useEffect(()=> {
    api.get("/employees").then(r=> setEmployees(r.data)).catch(()=> {});
  }, []);
  const onSubmit = async (d: Form) => {
    await api.post("/attendance", d);
    reset();
    alert("Attendance added");
  };
  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-lg mb-4">Add Attendance</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <select {...register("employeeId")} className="w-full border p-2 rounded">
          <option value="">Select employee</option>
          {employees.map(e => <option key={e.employeeId} value={e.employeeId}>{e.fullName}</option>)}
        </select>
        <input {...register("monthYear")} type="month" className="w-full border p-2 rounded" />
        <input {...register("workingHours")} type="number" placeholder="Working Hours" className="w-full border p-2 rounded" />
        <input {...register("overtimeHours")} type="number" placeholder="Overtime Hours" className="w-full border p-2 rounded" />
        <input {...register("unpaidLeaves")} type="number" placeholder="Unpaid Leaves" className="w-full border p-2 rounded" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Save Attendance</button>
      </form>
    </div>
  );
}
