"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FiBook,
  FiSettings,
  FiLogOut,
  // FiBriefcase,
  FiTag,
  FiFolder,
} from "react-icons/fi";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  onClick?: () => void;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [showSidebar, setShowSideBar] = useState<boolean>(false);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const mainItems: SidebarItem[] = [
    { label: "My Library", icon: <FiBook />, href: "/app/library" },
    { label: "Folders", icon: <FiFolder />, href: "/app/folders" },
    { label: "Categories", icon: <FiTag />, href: "/app/library/categories" },
    // {
    //   label: "Departments",
    //   icon: <FiBriefcase />,
    //   href: "/app/library/departments",
    // },
  ];

  const bottomItems: SidebarItem[] = [
    { label: "Settings", icon: <FiSettings />, href: "/app/settings" },
    { label: "Logout", icon: <FiLogOut />, onClick: handleLogout },
  ];

  const isActive = (href: string) => {
    if (pathname === href) return true;

    // Special handling to prevent "My Library" from being active when we're inside /app/library/categories/*
    if (
      href === "/app/library" &&
      pathname.startsWith("/app/library/categories")
    ) {
      return false;
    }

    return pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex-col">
        <div className="p-2 md:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-700 p-2 rounded-lg">
              <Image
                width={20}
                height={20}
                src="/logo.svg"
                alt="Shelf Logo"
                className="text-white"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">Shelf</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {mainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.href!)
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="w-5 h-5">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <nav className="px-4 py-6 border-t border-gray-200 space-y-1">
          {bottomItems.map((item) => {
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer w-full text-left"
                >
                  <span className="w-5 h-5">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              >
                <span className="w-5 h-5">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <button
        onClick={() => setShowSideBar(!showSidebar)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Toggle menu"
      >
        <HiMenu className="text-emerald-800 text-2xl" />
      </button>

      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setShowSideBar(false)}
        />
      )}

      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-700 p-2 rounded-lg">
              <Image
                width={20}
                height={20}
                src="/logo.svg"
                alt="Shelf Logo"
                className="text-white"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">Shelf</span>
          </div>
          <button
            onClick={() => setShowSideBar(false)}
            className="p-1"
            aria-label="Close menu"
          >
            <HiX className="text-emerald-800 text-3xl" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {mainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setShowSideBar(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.href!)
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="w-5 h-5">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <nav className="absolute bottom-0 w-full px-4 py-4 border-t border-gray-200 space-y-1 bg-white">
          {bottomItems.map((item) => {
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick?.();
                    setShowSideBar(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer w-full text-left"
                >
                  <span className="w-5 h-5">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setShowSideBar(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              >
                <span className="w-5 h-5">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};
