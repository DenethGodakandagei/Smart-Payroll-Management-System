// components/Navbar.tsx
import Link from "next/link";
import { useEffect, useState } from "react";
import { logout, getToken } from "../lib/auth";

export default function Navbar() {
  const [logged, setLogged] = useState(false);
  useEffect(()=> setLogged(Boolean(getToken())), []);
  return (
    <nav className="bg-white shadow">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <Link href="/"><a className="font-bold text-lg">SmartPayroll</a></Link>
          <Link href="/dashboard"><a className="text-sm text-gray-600">Dashboard</a></Link>
          <Link href="/employees"><a className="text-sm text-gray-600">Employees</a></Link>
          <Link href="/attendance"><a className="text-sm text-gray-600">Attendance</a></Link>
          <Link href="/payroll"><a className="text-sm text-gray-600">Payroll</a></Link>
        </div>
        <div>
          {logged ? (
            <button onClick={logout} className="btn">Logout</button>
          ) : (
            <Link href="/login"><a className="btn">Login</a></Link>
          )}
        </div>
      </div>
    </nav>
  );
}
