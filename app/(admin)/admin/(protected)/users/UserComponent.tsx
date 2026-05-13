import { AdminUserResponse } from "@/app/types/admin";
import { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";

export default function UserComponent({
  onClick,
  user,
}: {
  onClick: (action_type: any) => void;
  user: AdminUserResponse;
}) {
  const [actionBoxState, showActionBox] = useState(false);

  return (
    <tr
      key={user.id}
      className="group hover:bg-gray-50 dark:hover:bg-neutral-800/20 transition-colors overflow-y-hidden"
      onClick={() => showActionBox(!actionBoxState)}
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-500">
              @{user.username}
            </p>
          </div>
        </div>
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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
            Active
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right relative">
        <button
          className="p-2 text-gray-400 dark:text-neutral-600 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => showActionBox(true)}
        >
          <FiMoreHorizontal />
        </button>
        {actionBoxState && (
          <div className="top-1 right-0 absolute z-40 bg-background rounded-xl">
            <button
              className="p-2 my-1 cursor-pointer block"
              onClick={() => onClick(user.isBanned ? "unban" : "ban")}
            >
              {user.isBanned ? "Unban" : "Ban"}
            </button>
            <button
              className="p-2 my-1 cursor-pointer block"
              onClick={() => onClick("delete")}
            >
              Delete
            </button>
            <button
              className="p-2 my-1 cursor-pointer"
              onClick={() => onClick("assign a new role to")}
            >
              Assign New Role
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
