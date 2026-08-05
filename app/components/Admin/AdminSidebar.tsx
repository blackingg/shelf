"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiLayout, FiUsers, FiBook, FiLogOut } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { LogoStacked } from "@/app/components/Shared/Logo";
import { ConfirmModal } from "@/app/components/Shared/ConfirmModal";
import { useAuthActions } from "@/app/services";
import { AdminSystemStatus } from "@/app/components/Admin/AdminSystemStatus";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout: performLogout } = useAuthActions();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <FiLayout /> },
    { label: "Users", href: "/admin/users", icon: <FiUsers /> },
    { label: "Resources", href: "/admin/resources", icon: <FiBook /> },
  ];

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    performLogout();
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setShowMobileSidebar(true)}
        className="lg:hidden fixed top-3 left-4 z-40 p-2 text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
        aria-label="Toggle menu"
      >
        <HiMenu className="text-xl" />
      </button>

      {/* Mobile Backdrop */}
      {showMobileSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 lg:z-0 w-64 h-screen bg-background border-r border-line flex flex-col transition-transform duration-300 lg:transition-none lg:translate-x-0 ${
          showMobileSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-line-subtle flex justify-between items-center">
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-3"
            onClick={() => setShowMobileSidebar(false)}
          >
            <LogoStacked className="w-28 h-auto text-primary" />
            <span className="text-[10px] font-medium text-primary uppercase tracking-[0.2em] mt-1 ml-1">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <HiX className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMobileSidebar(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/5 text-primary"
                    : "text-muted hover:bg-wash hover:text-gray-900 dark:hover:text-white"
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

        <div className="p-4 border-t border-line-subtle space-y-3">
          <button
            onClick={handleLogoutClick}
            className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors text-muted hover:bg-red-50 dark:hover:bg-red-950/15 hover:text-red-600 dark:hover:text-red-400 w-full text-left cursor-pointer"
          >
            <span className="text-lg text-gray-400 hover:text-inherit">
              <FiLogOut />
            </span>
            <span>Logout</span>
          </button>

          <AdminSystemStatus />
        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to log out of your admin session?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        isDanger={true}
      />
    </>
  );
};
