"use client";
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
  {
    label: "Security",
    href: "/app/settings/security",
    icon: <FiLock className="w-5 h-5" />,
    description: "Password and security settings",
  },
];

export const SettingsSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 sticky top-0 z-10 md:static">
      <div className="p-4 md:p-6">
        <div className="mb-4 md:mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Settings</h2>
          <p className="text-sm text-gray-500 hidden md:block">
            Manage your app preferences
          </p>
        </div>
        <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible pb-3 md:pb-0 px-3 md:px-0 no-scrollbar">
          {settingsNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2.5 md:py-3 rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? "bg-primary text-white shadow-md md:shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="w-5 h-5">{item.icon}</span>

                <span className="font-medium text-sm md:text-base">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
