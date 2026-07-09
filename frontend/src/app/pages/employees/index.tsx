// pages/employees/index.tsx
import { useEffect, useState } from "react";
import api from "../../lib/api";
import Link from "next/link";
import { Employee } from "../../types";

export default function EmployeesPage() {
  const [list, setList] = useState<Employee[]>([]);
  useEffect(()=> {
    api.get("/employees").then(r=> setList(r.data)).catch(()=> {});
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Employees</h1>
        <Link href="/employees/create"><a className="bg-blue-600 text-white px-3 py-1 rounded">Add Employee</a></Link>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Designation</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(e => (
              <tr key={e.employeeId} className="border-t">
                <td className="p-2">{e.employeeId}</td>
                <td className="p-2">{e.fullName}</td>
                <td className="p-2">{e.designation}</td>
                <td className="p-2">{e.basicSalary}</td>
                <td className="p-2">
                  <Link href={`/employees/${e.employeeId}`}><a className="text-blue-600 mr-2">View</a></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
