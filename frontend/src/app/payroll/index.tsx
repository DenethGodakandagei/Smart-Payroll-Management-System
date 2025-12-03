// pages/payroll/index.tsx
import { useState } from "react";
import api from "../../lib/api";
import dayjs from "dayjs";

export default function PayrollPage(){
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [result, setResult] = useState<any[]>([]);

  const generateAll = async () => {
    const m = dayjs(month+"-01").format("YYYY-MM-DD");
    const res = await api.post(`/payroll/generate/all?month=${encodeURIComponent(m)}`);
    setResult(res.data);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Payroll</h1>
      <div className="bg-white p-4 rounded shadow max-w-md">
        <div className="mb-3">
          <label className="block mb-1">Month</label>
          <input value={month} onChange={(e)=>setMonth(e.target.value)} type="month" className="w-full border p-2 rounded" />
        </div>
        <button onClick={generateAll} className="bg-indigo-600 text-white px-4 py-2 rounded">Generate All Payroll</button>
      </div>

      <div className="mt-6">
        {result.length === 0 ? <div className="text-gray-500">No payrolls yet</div> : (
          <table className="w-full bg-white rounded shadow mt-3">
            <thead className="bg-gray-100"><tr><th className="p-2">Employee</th><th>Net</th></tr></thead>
            <tbody>
              {result.map((r:any)=>(
                <tr key={r.payrollId} className="border-t">
                  <td className="p-2">{r.employee?.fullName || r.employeeId}</td>
                  <td className="p-2">{r.netSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
