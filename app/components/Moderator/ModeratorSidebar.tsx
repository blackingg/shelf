"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiHome, FiFlag, FiInbox, FiArrowLeft, FiLogOut } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { LogoStacked } from "@/app/components/Shared/Logo";
import { ConfirmModal } from "@/app/components/Shared/ConfirmModal";
import { useAuthActions, useUser } from "@/app/services";

export const ModeratorSidebar = () => {
  const pathname = usePathname();
  const { me } = useUser();
  const { logout: performLogout } = useAuthActions();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const isAdmin = me?.role === "ADMIN" || me?.role === "SUPER_ADMIN";

  const navItems = [
    { label: "Dashboard", href: "/moderator", icon: <FiHome /> },
    { label: "Flagged Content", href: "/moderator/flags", icon: <FiFlag /> },
    { label: "Pending Books", href: "/moderator/pending", icon: <FiInbox /> },
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
        className={`fixed lg:sticky top-0 left-0 z-40 lg:z-0 w-64 h-screen bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col transition-transform duration-300 lg:transition-none lg:translate-x-0 ${
          showMobileSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
          <Link
            href="/library"
            className="flex items-center space-x-3 group"
            onClick={() => setShowMobileSidebar(false)}
          >
            <LogoStacked className="w-24 h-auto text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] font-medium text-primary uppercase tracking-[0.2em] mt-0.5">
                Moderator
              </span>
            </div>
          </Link>
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <HiX className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="px-4 text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-4">
            MOderator
          </p>
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
                    : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className={`text-lg ${isActive ? "text-primary" : "text-gray-400"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-neutral-800 space-y-2">
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={() => setShowMobileSidebar(false)}
              className="flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FiArrowLeft className="text-lg text-gray-400" />
              <span>Back to Admin</span>
            </Link>
          )}

          <Link
            href="/library"
            onClick={() => setShowMobileSidebar(false)}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FiArrowLeft className="text-lg text-gray-400" />
            <span>Back to App</span>
          </Link>

          <button
            onClick={handleLogoutClick}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors text-gray-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950/15 hover:text-red-600 dark:hover:text-red-400 w-full text-left cursor-pointer mt-1"
          >
            <span className="text-lg text-gray-400 hover:text-inherit">
              <FiLogOut />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to log out of your moderator session?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        isDanger={true}
      />
    </>
  );
};
