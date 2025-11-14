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
} from "react-icons/fi";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  onClick?: () => void;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

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
    { label: "Settings", icon: <FiSettings />, href: "/profile/settings" },
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
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
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
  );
};
