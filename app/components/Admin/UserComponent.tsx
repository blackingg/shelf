"use client";

import Link from "next/link";
import { AdminUserResponse } from "@/app/types/admin";
import { useState, useRef, useEffect } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { UserActionType } from "./UserActionModals";

export default function UserComponent({
  onAction,
  user,
}: {
  onAction: (actionType: UserActionType) => void;
  user: AdminUserResponse;
}) {
  const [actionBoxState, showActionBox] = useState(false);
  const dropdownRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        showActionBox(false);
      }
    };
    if (actionBoxState) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionBoxState]);

  return (
    <tr className="group hover:bg-gray-50 dark:hover:bg-neutral-800/20 transition-colors overflow-y-hidden">
      <td className="px-6 py-4">
        <Link
          href={`/admin/users/${user.id}`}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-500">
              @{user.username}
            </p>
          </div>
        </Link>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${user.role === "USER" ? "bg-purple-500" : "bg-blue-500"}`}
          />
          <span className="text-xs text-gray-600 dark:text-neutral-300 capitalize">
            {user.role.toLowerCase().replace("_", " ")}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        {user.isBanned ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">
            Banned
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
            Active
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right relative" ref={dropdownRef}>
        <button
          className="p-2 text-gray-400 dark:text-neutral-600 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            showActionBox(!actionBoxState);
          }}
        >
          <FiMoreHorizontal />
        </button>
        {actionBoxState && (
          <div className="top-1 right-0 absolute z-40 bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-neutral-800 py-1 min-w-[140px]">
            <Link
              href={`/admin/users/${user.id}`}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 w-full text-left transition-colors"
              onClick={() => showActionBox(false)}
            >
              View Details
            </Link>
            <button
              className="px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 w-full text-left transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                showActionBox(false);
                onAction(user.isBanned ? "unban" : "ban");
              }}
            >
              {user.isBanned ? "Unban" : "Ban"}
            </button>
            <button
              className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-neutral-800 w-full text-left transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                showActionBox(false);
                onAction("delete");
              }}
            >
              Delete
            </button>
            <button
              className="px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 w-full text-left transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                showActionBox(false);
                onAction("assign");
              }}
            >
              Assign New Role
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
