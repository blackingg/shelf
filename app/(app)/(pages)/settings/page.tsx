"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiChevronRight,
  FiMonitor,
  FiSettings,
  FiUser,
} from "react-icons/fi";

const sections = [
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
];

/**
 * Mobile settings home: a menu of sections, each opening its own page.
 * Desktop uses the sidebar layout instead, so redirect to the first section.
 */
export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      router.replace("/settings/profile");
    }
  }, [router]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-foreground">
        Settings
      </h1>

      <nav className="divide-y divide-line-subtle lg:bg-white lg:dark:bg-neutral-900 lg:rounded-lg lg:border lg:border-gray-200 lg:dark:border-neutral-800 lg:overflow-hidden">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex items-center gap-4 py-4 lg:px-4 active:bg-pressed transition-colors"
          >
            <span className="p-2.5 bg-primary/5 rounded-sm text-primary shrink-0">
              {section.icon}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-medium text-foreground">
                {section.label}
              </span>
              <span className="block text-sm text-muted truncate">
                {section.description}
              </span>
            </span>
            <FiChevronRight className="w-4 h-4 text-faint shrink-0" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
