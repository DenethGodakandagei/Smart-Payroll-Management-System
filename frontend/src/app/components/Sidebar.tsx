import Link from "next/link";
import { useState } from "react";
import { HomeIcon, UserIcon, CalendarIcon, DocumentTextIcon, CogIcon, ArrowRightOnRectangleIcon  } from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, href: "/" },
    { name: "Employees", icon: <UserIcon className="w-5 h-5" />, href: "/employees" },
    { name: "Attendance", icon: <CalendarIcon className="w-5 h-5" />, href: "/attendance" },
    { name: "Payroll", icon: <DocumentTextIcon className="w-5 h-5" />, href: "/payroll" },
    { name: "Reports", icon: <DocumentTextIcon className="w-5 h-5" />, href: "/reports" },
    { name: "Settings", icon: <CogIcon className="w-5 h-5" />, href: "/settings" },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r shadow-lg">
      <div className="flex items-center justify-center h-20 border-b">
        <h1 className="text-xl font-bold">HR Management</h1>
      </div>

     <nav className="flex-1 p-4">
  {menuItems.map((item) => (
    <Link
      key={item.name}
      href={item.href}
      className={`flex items-center gap-3 p-2 mb-2 rounded-lg hover:bg-blue-100 ${
        active === item.name ? "bg-blue-100 font-semibold" : "text-gray-700"
      }`}
    >
      {item.name}
    </Link>
  ))}
</nav>

      <div className="p-4 border-t">
        <button className="flex items-center gap-2 text-gray-700 hover:text-red-500">
          <ArrowRightOnRectangleIcon  className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
