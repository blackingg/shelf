"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser, FiSettings, FiBell, FiLock, FiMonitor } from "react-icons/fi";

const settingsNavItems = [
  {
    label: "Profile",
    href: "/app/settings/profile",
    icon: <FiUser className="w-5 h-5" />,
    description: "Personalize your profile details",
  },
  {
    label: "Account",
    href: "/app/settings/account",
    icon: <FiSettings className="w-5 h-5" />,
    description: "Manage your account settings",
  },
  // {
  //   label: "Appearance",
  //   href: "/app/settings/appearance",
  //   icon: <FiMonitor className="w-5 h-5" />,
  //   description: "Customize the look and feel",
  // },
  {
    label: "Notifications",
    href: "/app/settings/notifications",
    icon: <FiBell className="w-5 h-5" />,
    description: "Control your notification preferences",
  },
  // {
  //   label: "Security",
  //   href: "/app/settings/security",
  //   icon: <FiLock className="w-5 h-5" />,
  //   description: "Password and security settings",
  // },
];

export const SettingsSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Settings</h2>
        <p className="text-sm text-gray-500 mb-6">
          Manage your app preferences
        </p>
        <nav className="space-y-1">
          {settingsNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="w-5 h-5">{item.icon}</span>

                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
