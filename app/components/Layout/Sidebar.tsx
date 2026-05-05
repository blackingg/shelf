"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoStacked, Logo } from "@/app/components/Shared/Logo";
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
import { useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { useUser, useAuthActions } from "@/app/services";
import { ConfirmModal } from "../Shared/ConfirmModal";

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
  const router = useRouter();
  const { logout: performLogout } = useAuthActions();
  const { me: user, isAuthenticated, isHydrated } = useUser();
  const [showSidebar, setShowSideBar] = useState<boolean>(false);
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

  const isActive = (href: string) => {
    if (pathname === href) return true;

    // Prevent "My Library" from being active on categories/departments sub-routes
    if (
      href === "/library" &&
      (pathname.startsWith("/library/categories") ||
        pathname.startsWith("/library/departments"))
    ) {
      return false;
    }

    // Prevent "Discover" from matching other /app/* routes
    if (href === "/discover" && pathname !== "/discover") {
      return false;
    }

    return pathname.startsWith(`${href}/`);
  };

  const navLinkClass = (href: string, isMobile: boolean = false) =>
    `flex items-center space-x-3 ${isMobile ? "px-4 py-3 text-base" : "px-3 py-2.5 text-sm"} rounded-sm transition-colors duration-150 ${
      isActive(href)
        ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-medium"
        : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
    }`;

  return (
    <>
      <aside className="hidden lg:flex w-56 bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 h-screen sticky top-0 flex-col">
        <div className="px-5 py-8">
          <Link
            href={"/discover"}
            className="flex items-center space-x-2"
          >
            <LogoStacked className="w-22 h-auto text-[#072c0b] dark:text-[#D0FDC2]" />
          </Link>
        </div>

        {!isHydrated ? (
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
            <nav className="px-3 py-4 border-t border-gray-100 dark:border-neutral-800 space-y-0.5">
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

            <nav className="px-3 py-4 border-t border-gray-100 dark:border-neutral-800 space-y-0.5">
              {bottomItems.map((item) => {
                if (item.onClick) {
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm text-gray-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150 cursor-pointer w-full text-left"
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
                        : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
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

      <button
        onClick={() => setShowSideBar(!showSidebar)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm"
        aria-label="Toggle menu"
      >
        <HiMenu className="text-gray-600 dark:text-neutral-300 text-2xl" />
      </button>

      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setShowSideBar(false)}
        />
      )}

      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 z-50 transform transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <Logo className="w-8 h-8 text-[#072c0b] dark:text-[#D0FDC2]" />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Shelf
            </span>
          </div>
          <button
            onClick={() => setShowSideBar(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <HiX className="text-gray-500 dark:text-neutral-400 text-2xl" />
          </button>
        </div>

        {!isHydrated ? (
          <nav className="flex-1 px-4 py-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-3 px-4 py-3"
              >
                <div className="w-5 h-5 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse shrink-0" />
                <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-md w-32 animate-pulse" />
              </div>
            ))}
          </nav>
        ) : (
          <>
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
              {visibleMainItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setShowSideBar(false)}
                  className={navLinkClass(item.href!, true)}
                >
                  <span className="w-5 h-5 shrink-0">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 px-2 py-0.5 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <nav className="absolute bottom-0 w-full px-4 py-5 border-t border-gray-100 dark:border-neutral-800 space-y-1 bg-white dark:bg-neutral-950 pb-8">
              {bottomItems.map((item) => {
                if (item.onClick) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.onClick?.();
                        setShowSideBar(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base text-gray-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150 cursor-pointer w-full text-left"
                    >
                      <span className="w-5 h-5 shrink-0">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                }

                const isGuestCTA = !isAuthenticated;
                const isRegister = item.label === "Create account";

                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    onClick={() => setShowSideBar(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base transition-colors duration-150 ${
                      isGuestCTA && isRegister
                        ? "text-primary dark:text-primary hover:bg-primary/5 font-medium"
                        : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="w-5 h-5 shrink-0">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </>
        )}
      </div>

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
