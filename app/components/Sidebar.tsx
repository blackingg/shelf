"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FiBook,
  FiSettings,
  FiLogOut,
  FiBriefcase,
  FiTag,
  FiFolder,
  FiHeart,
  FiCheckCircle,
  FiBookmark,
  FiBookOpen,
} from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  onClick?: () => void;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showSidebar, setShowSideBar] = useState<boolean>(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/app/auth/login");
  };

  const mainItems: SidebarItem[] = [
    { label: "My Library", icon: <FiBook />, href: "/app/library" },
    { label: "Bookmarks", icon: <FiBookmark />, href: "/app/bookmarks" },
    { label: "Folders", icon: <FiFolder />, href: "/app/folders" },
    { label: "Categories", icon: <FiTag />, href: "/app/library/categories" },
    {
      label: "Departments",
      icon: <FiBriefcase />,
      href: "/app/library/departments",
    },
    {label: "Viewer", icon: <FiBookOpen />, href:"/app/upload-and-read"}, 
    { label: "Donate Book", icon: <FiHeart />, href: "/app/books/upload" },
    { label: "Moderator", icon: <FiCheckCircle />, href: "/app/moderator" },
  ];

  const bottomItems: SidebarItem[] = [
    { label: "Settings", icon: <FiSettings />, href: "/app/settings" },
    { label: "Logout", icon: <FiLogOut />, onClick: handleLogout },
  ];

  const isActive = (href: string) => {
    if (pathname === href) return true;

    // Special handling to prevent "My Library" from being active when we're inside /app/library/categories/ or /app/library/departments/*
    if (
      (href === "/app/library" &&
        pathname.startsWith("/app/library/categories")) ||
      (href === "/app/library" &&
        pathname.startsWith("/app/library/departments"))
    ) {
      return false;
    }

    return pathname.startsWith(`${href}/`);
  };

  const navLinkClass = (href: string, isMobile: boolean = false) =>
    `flex items-center space-x-3 ${isMobile ? "px-4 py-3 text-base" : "px-3 py-2.5 text-sm"} rounded-md transition-colors duration-150 ${
      isActive(href)
        ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-medium"
        : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
    }`;

  return (
    <>
      <aside className="hidden lg:flex w-56 bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 h-screen sticky top-0 flex-col">
        <div className="px-5 py-5 border-b border-gray-100 dark:border-neutral-800">
          <Link
            href={"/app/library"}
            className="flex items-center space-x-2"
          >
            <Image
              width={18}
              height={18}
              src="/logo.png"
              alt="Shelf Logo"
            />
            <span className="text-base font-medium text-gray-900 dark:text-white">
              Shelf
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {mainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href!}
              className={navLinkClass(item.href!)}
            >
              <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
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
                  <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
              >
                <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
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
            <Image
              width={24}
              height={24}
              src="/logo.png"
              alt="Shelf Logo"
            />
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

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {mainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setShowSideBar(false)}
              className={navLinkClass(item.href!, true)}
            >
              <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
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

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setShowSideBar(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
              >
                <span className="w-5 h-5 shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};
