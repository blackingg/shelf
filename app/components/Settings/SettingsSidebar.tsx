"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser, FiSettings, FiBell, FiLock, FiMonitor } from "react-icons/fi";

const settingsNavItems = [
  {
    label: "Profile",
    href: "/settings/profile",
    icon: <FiUser className="w-5 h-5" />,
    description: "Personalize your profile details",
  },
  {
    label: "Account",
    href: "/settings/account",
    icon: <FiSettings className="w-5 h-5" />,
    description: "Manage your account settings",
  },
  {
    label: "Appearance",
    href: "/settings/appearance",
    icon: <FiMonitor className="w-5 h-5" />,
    description: "Customize the look and feel",
  },
  // {
  //   label: "Notifications",
  //   href: "/settings/notifications",
  //   icon: <FiBell className="w-5 h-5" />,
  //   description: "Control your notification preferences",
  // },
  // {
  //   label: "Security",
  //   href: "/settings/security",
  //   icon: <FiLock className="w-5 h-5" />,
  //   description: "Password and security settings",
  // },
];

export const SettingsSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-72 bg-background border-r border-line shrink-0 sticky top-0 z-10">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground mb-1">
            Settings
          </h2>
          <p className="text-sm text-muted">
            Manage your app preferences
          </p>
        </div>
        <nav className="flex flex-col space-y-0.5">
          {settingsNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors duration-150 ${
                  isActive
                    ? "bg-gray-100 dark:bg-white/5 text-foreground font-medium shadow-none"
                    : "text-muted hover:bg-wash hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="w-4 h-4">{item.icon}</span>

                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
