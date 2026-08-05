"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoStacked } from "@/app/components/Shared/Logo";
import {
  FiBook,
  FiSettings,
  FiLogOut,
  FiCompass,
  FiBookOpen,
  FiBriefcase,
  FiLogIn,
  FiUserPlus,
  FiShield,
} from "react-icons/fi";
import { useState } from "react";
import { useUser, useAuthActions } from "@/app/services";
import { ConfirmModal } from "../Shared/ConfirmModal";
import { isNavActive } from "./navigation";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  onClick?: () => void;
  /** If true, only show when authenticated */
  requiresAuth?: boolean;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout: performLogout } = useAuthActions();
  const { me: user, isAuthenticated, isLoading } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    performLogout();
    setShowLogoutModal(false);
  };

  const mainItems: SidebarItem[] = [
    { label: "Discover", icon: <FiCompass />, href: "/discover" },
    {
      label: "My Library",
      icon: <FiBook />,
      href: "/library",
      requiresAuth: true,
    },
    {
      label: isAuthenticated ? "My Department" : "Departments",
      icon: <FiBriefcase />,
      href: "/library/departments",
    },
    {
      label: "Viewer",
      icon: <FiBookOpen />,
      href: "/upload-and-read",
      requiresAuth: true,
    },
  ];

  const hasModeratorAccess =
    user?.role === "MODERATOR" ||
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN";

  if (isAuthenticated && hasModeratorAccess) {
    mainItems.push({
      label: "Moderator Center",
      icon: <FiShield />,
      href: "/moderator",
      requiresAuth: true,
    });
  }

  const visibleMainItems = mainItems.filter(
    (item) => !item.requiresAuth || isAuthenticated,
  );

  const authenticatedBottomItems: SidebarItem[] = [
    { label: "Settings", icon: <FiSettings />, href: "/settings/profile" },
    { label: "Logout", icon: <FiLogOut />, onClick: handleLogoutClick },
  ];

  const guestBottomItems: SidebarItem[] = [
    { label: "Log in", icon: <FiLogIn />, href: "/auth/login" },
    {
      label: "Create account",
      icon: <FiUserPlus />,
      href: "/auth/register",
    },
  ];

  const bottomItems = isAuthenticated
    ? authenticatedBottomItems
    : guestBottomItems;

  const navLinkClass = (href: string) =>
    `flex items-center space-x-3 px-3 py-2.5 text-sm rounded-sm transition-colors duration-150 ${
      isNavActive(pathname, href)
        ? "bg-gray-100 dark:bg-white/5 text-foreground font-medium"
        : "text-muted hover:bg-wash hover:text-gray-900 dark:hover:text-white"
    }`;

  return (
    <>
      <aside className="hidden lg:flex w-56 bg-surface border-r border-line h-screen sticky top-0 flex-col">
        <div className="px-5 py-8">
          <Link
            href={"/discover"}
            className="flex items-center space-x-2"
          >
            <LogoStacked className="w-22 h-auto text-[#072c0b] dark:text-[#D0FDC2]" />
          </Link>
        </div>

        {isLoading ? (
          <>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 px-3 py-2.5"
                >
                  <div className="w-4 h-4 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse shrink-0" />
                  <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-md w-24 animate-pulse" />
                </div>
              ))}
            </nav>
            <nav className="px-3 py-4 border-t border-line-subtle space-y-0.5">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 px-3 py-2.5"
                >
                  <div className="w-4 h-4 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse shrink-0" />
                  <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-md w-20 animate-pulse" />
                </div>
              ))}
            </nav>
          </>
        ) : (
          <>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {visibleMainItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={navLinkClass(item.href!)}
                >
                  <span className="w-4 h-4 shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 px-1.5 py-0.5 rounded-md font-medium">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <nav className="px-3 py-4 border-t border-line-subtle space-y-0.5">
              {bottomItems.map((item) => {
                if (item.onClick) {
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm text-muted hover:bg-danger-wash hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150 cursor-pointer w-full text-left"
                    >
                      <span className="w-4 h-4 shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                }

                // Use accent styling for guest CTA buttons
                const isGuestCTA = !isAuthenticated;
                const isRegister = item.label === "Create account";

                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ${
                      isGuestCTA && isRegister
                        ? "text-primary dark:text-primary hover:bg-primary/5 font-medium"
                        : "text-muted hover:bg-wash hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="w-4 h-4 shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </>
        )}
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to log out of your session?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        isDanger={true}
      />
    </>
  );
};
