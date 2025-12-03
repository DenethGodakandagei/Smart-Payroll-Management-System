"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import Sidebar from "@/app/components/Sidebar";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(()=>{
    // optional: fetch dashboard data from backend if you implement endpoint
    // api.get('/dashboard/summary').then(r=>setStats(r.data));
  },[]);

  return (
    
    <div>
      <Sidebar />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Employees: --</div>
        <div className="p-4 bg-white rounded shadow">Payrolls this month: --</div>
        <div className="p-4 bg-white rounded shadow">Pending attendance: --</div>
      </div>
    </div>
  );
}
