"use client";

import { useState } from "react";
import { useGetAdminUsersQuery } from "@/app/services";
import { UserRole } from "@/app/types/user";
import { FiSearch, FiUser } from "react-icons/fi";
import { FormSelect } from "@/app/components/Form/FormSelect";
import UserComponent from "@/app/components/Admin/UserComponent";
import { AdminUserResponse } from "@/app/types/admin";
import { Pagination } from "@/app/components/Library/Pagination";
import {
  UserActionModals,
  UserActionType,
} from "@/app/components/Admin/UserActionModals";
import AdminTableSkeleton from "@/app/components/Skeletons/Admin/AdminTableSkeleton";

interface RoleOption {
  value: UserRole | "";
  label: string;
}

interface StatusOption {
  value: "" | "active" | "banned";
  label: string;
}

export default function AdminUsersPage() {
  const roleOptions: RoleOption[] = [
    { value: "", label: "All Roles" },
    { value: "USER", label: "Regular Users" },
    { value: "MODERATOR", label: "Moderators" },
    { value: "ADMIN", label: "Admins" },
    { value: "SUPER_ADMIN", label: "Super Admins" },
  ];

  const statusOptions: StatusOption[] = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "banned", label: "Banned" },
  ];

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleOption>(roleOptions[0]);
  const [statusFilter, setStatusFilter] = useState<StatusOption>(
    statusOptions[0],
  );
  const [page, setPage] = useState(1);

  const [actionUser, setActionUser] = useState<AdminUserResponse | null>(null);
  const [actionType, setActionType] = useState<UserActionType | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (option: StatusOption | null) => {
    if (option) {
      setStatusFilter(option);
      setPage(1);
    }
  };

  const handleRoleChange = (option: RoleOption | null) => {
    if (option) {
      setRoleFilter(option);
      setPage(1);
    }
  };

  const { data: userData, isLoading } = useGetAdminUsersQuery({
    q: search || undefined,
    role: roleFilter.value || undefined,
    is_banned:
      statusFilter.value === "banned"
        ? true
        : statusFilter.value === "active"
          ? false
          : undefined,
    page,
    limit: 10,
  });

  const users = userData?.items;

  const openAction = (user: AdminUserResponse, type: UserActionType) => {
    setActionUser(user);
    setActionType(type);
  };

  const closeAction = () => {
    setActionUser(null);
    setActionType(null);
  };

  return (
    <div className="space-y-10">
      <UserActionModals
        user={actionUser}
        actionType={actionType}
        onClose={closeAction}
      />

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
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center space-x-3">
          <FormSelect<StatusOption>
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusChange}
            isClearable={false}
            isSearchable={false}
            className="w-36"
          />
          <FormSelect<RoleOption>
            options={roleOptions}
            value={roleFilter}
            onChange={handleRoleChange}
            isClearable={false}
            isSearchable={false}
            className="w-48"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden flex flex-col">
        {isLoading ? (
          <AdminTableSkeleton rows={10} />
        ) : users?.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FiUser className="mx-auto text-3xl text-gray-200 dark:text-neutral-800" />
            <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
              No users found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-50 dark:border-neutral-800/50">
                    <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500">
                      User
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500">
                      Role
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500">
                      Status
                    </th>
                    <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/30">
                  {users?.map((user) => (
                    <UserComponent
                      user={user}
                      key={user.id}
                      onAction={(type) => openAction(user, type)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {userData && userData.totalPages > 1 && (
              <div className="border-t border-gray-100 dark:border-neutral-800 bg-gray-50/30 dark:bg-neutral-900/30 px-6">
                <Pagination
                  currentPage={page}
                  totalPages={userData.totalPages}
                  onPageChange={(p) => setPage(p)}
                  isLoading={isLoading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
