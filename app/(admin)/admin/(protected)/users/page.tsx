"use client";

import { useState } from "react";
import { useGetAdminUsersQuery } from "@/app/services";
import { UserRole } from "@/app/types/user";
import { FiSearch, FiFilter, FiMoreHorizontal, FiUser, FiShield } from "react-icons/fi";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  
  const { data: userData, isLoading } = useGetAdminUsersQuery({
    q: search || undefined,
    role: roleFilter || undefined,
  });

  const users = userData?.items;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-1">
          User Management
        </h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Manage system access, roles, and account statuses.
        </p>
      </section>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, username, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md text-sm text-gray-600 dark:text-neutral-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
          >
            <option value="">All Roles</option>
            <option value="USER">Regular Users</option>
            <option value="MODERATOR">Moderators</option>
            <option value="ADMIN">Admins</option>
            <option value="SUPER_ADMIN">Super Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-500 dark:text-neutral-400">
            Loading users...
          </div>
        ) : users?.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FiUser className="mx-auto text-3xl text-gray-200 dark:text-neutral-800" />
            <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
              No users found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-50 dark:border-neutral-800/50">
                  <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500">User</th>
                  <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500">Role</th>
                  <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500">Status</th>
                  <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/30">
                {users?.map((user) => (
                  <tr key={user.id} className="group hover:bg-gray-50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                          <p className="text-xs text-gray-500 dark:text-neutral-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.role === 'USER' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                        <span className="text-xs text-gray-600 dark:text-neutral-300 capitalize">
                          {user.role.toLowerCase().replace('_', ' ')}
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
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 dark:text-neutral-600 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <FiMoreHorizontal />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
