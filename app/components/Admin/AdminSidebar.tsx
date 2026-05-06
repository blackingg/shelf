"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLayout, FiUsers, FiBook, FiSettings } from "react-icons/fi";
import { LogoStacked } from "@/app/components/Shared/Logo";

export const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <FiLayout /> },
    { label: "Users", href: "/admin/users", icon: <FiUsers /> },
    { label: "Resources", href: "/admin/resources", icon: <FiBook /> },
    { label: "Settings", href: "/admin/settings", icon: <FiSettings /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100 dark:border-neutral-800">
        <Link href="/admin/dashboard" className="flex items-center space-x-3">
          <LogoStacked className="w-28 h-auto text-[#072c0b] dark:text-[#D0FDC2]" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1 ml-1">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? "bg-primary/5 text-primary"
                  : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span className={`text-lg ${isActive ? "text-primary" : "text-gray-400"}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-neutral-800">
        <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            System Status
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Operational
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
