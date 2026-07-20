"use client";

import Link from "next/link";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBriefcase,
  FiChevronRight,
  FiLogOut,
  FiSettings,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useUser, useAuthActions } from "@/app/services";
import { ConfirmModal } from "../Shared/ConfirmModal";
import { Sheet } from "../Shared/Sheet";

interface DrawerItem {
  label: string;
  description: string;
  icon: IconType;
  href: string;
}

export const MoreDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { me: user } = useUser();
  const { logout: performLogout } = useAuthActions();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userName = user?.username || "User";

  const hasModeratorAccess =
    user?.role === "MODERATOR" ||
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN";

  const navItems: DrawerItem[] = [
    {
      label: "View Profile",
      description: "See your public profile",
      icon: FiUser,
      href: `/profile/${userName}`,
    },
    {
      label: "My Department",
      description: "Resources for your department",
      icon: FiBriefcase,
      href: "/library/departments",
    },
    ...(hasModeratorAccess
      ? [
          {
            label: "Moderator Center",
            description: "Review and manage content",
            icon: FiShield,
            href: "/moderator",
          },
        ]
      : []),
    {
      label: "Settings",
      description: "Profile, account and appearance",
      icon: FiSettings,
      href: "/settings",
    },
  ];

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={onClose}
      >
        <nav className="py-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-4 pl-6 pr-4 py-4 text-foreground active:bg-pressed transition-colors"
            >
              <item.icon className="w-6 h-6 shrink-0 text-muted" />
              <span className="flex-1 min-w-0">
                <span className="block text-base font-medium">
                  {item.label}
                </span>
                <span className="block text-sm text-muted truncate">
                  {item.description}
                </span>
              </span>
              <FiChevronRight className="w-4 h-4 text-faint shrink-0" />
            </Link>
          ))}
        </nav>

        <div className="border-t border-line-subtle py-2">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-4 pl-6 pr-4 py-4 text-danger active:bg-danger-wash transition-colors text-left"
          >
            <FiLogOut className="w-6 h-6 shrink-0" />
            <span className="flex-1 min-w-0">
              <span className="block text-base font-medium">Logout</span>
              <span className="block text-sm text-danger/70">
                Sign out of your session
              </span>
            </span>
          </button>
        </div>
      </Sheet>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          performLogout();
          setShowLogoutModal(false);
          onClose();
        }}
        title="Logout Confirmation"
        message="Are you sure you want to log out of your session?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        isDanger={true}
      />
    </>
  );
};
