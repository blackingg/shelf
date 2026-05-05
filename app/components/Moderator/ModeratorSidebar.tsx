"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiFlag, FiInbox, FiArrowLeft } from "react-icons/fi";
import { LogoStacked } from "@/app/components/Shared/Logo";

export const ModeratorSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/moderator", icon: <FiHome /> },
    { label: "Flagged Content", href: "/moderator/flags", icon: <FiFlag /> },
    { label: "Pending Books", href: "/moderator/pending", icon: <FiInbox /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-gray-100 dark:border-neutral-800 flex flex-col h-screen sticky top-0 z-40">
      <div className="p-6 border-b border-gray-50 dark:border-neutral-800/50">
        <Link href="/library" className="flex items-center space-x-3 group">
          <LogoStacked className="w-24 h-auto text-[#072c0b] dark:text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em]">
              Moderator
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="px-4 text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-4">
          Management
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                  : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span className={`text-lg ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50 dark:border-neutral-800/50">
        <Link
          href="/library"
          className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          <FiArrowLeft className="text-lg" />
          <span>Back to App</span>
        </Link>
      </div>
    </aside>
  );
};
