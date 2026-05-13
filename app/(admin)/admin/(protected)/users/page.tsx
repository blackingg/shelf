"use client";

import { useState } from "react";
import { useAdminActions, useGetAdminUsersQuery } from "@/app/services";
import { UserRole } from "@/app/types/user";
import { FiSearch, FiMoreHorizontal, FiUser, FiX } from "react-icons/fi";
import { FormSelect } from "@/app/components/Form/FormSelect";
import UserComponent from "./UserComponent";
import { AdminUserResponse } from "@/app/types/admin";
import { SpinnerLoader } from "@/app/components/Loader/SpinnerLoader";
import { isatty } from "tty";
interface UserActionInterface {
  action_type: string;
  action_is_on: AdminUserResponse;
}

export default function AdminUsersPage() {
  interface RoleOption {
    value: UserRole | "";
    label: string;
  }

  const roleOptions: RoleOption[] = [
    { value: "", label: "All Roles" },
    { value: "USER", label: "Regular Users" },
    { value: "MODERATOR", label: "Moderators" },
    { value: "ADMIN", label: "Admins" },
    { value: "SUPER_ADMIN", label: "Super Admins" },
  ];

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleOption>(roleOptions[0]);

  const { data: userData, isLoading } = useGetAdminUsersQuery({
    q: search || undefined,
    role: roleFilter.value || undefined,
  });
  const { banUser, unbanUser, deleteUser, assignRole } = useAdminActions();

  const [actionObj, attemptAction] = useState<UserActionInterface>({
    action_type: "",
    action_is_on: {} as AdminUserResponse,
  });

  const [isActionModalShown, showActionModal] = useState(false);

  const users = userData?.items;

  return (
    <div className="space-y-10">
      <ActionProcessingModal
        action={actionObj}
        isShown={isActionModalShown}
        onClick={() => showActionModal(false)}
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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center space-x-3">
          <FormSelect<RoleOption>
            options={roleOptions}
            value={roleFilter}
            onChange={(option) => option && setRoleFilter(option)}
            isClearable={false}
            isSearchable={false}
            className="w-48"
          />
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
                    onClick={(action_type) => {
                      showActionModal(true);
                      attemptAction({
                        ...actionObj,
                        action_type: action_type,
                        action_is_on: user,
                      });
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionProcessingModal({
  isShown,
  onClick,
  action,
}: {
  action: UserActionInterface;
  onClick: () => void;
  isShown: boolean;
}) {
  const { action_type, action_is_on: user } = action;
  const {
    isAssigning,
    isBanning,
    isDeleting,
    isUnbanning,
    banUser,
    deleteUser,
    assignRole,
    unbanUser,
  } = useAdminActions();
  const roleTypes: UserRole[] = ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"];
  const [roleState, updateRole] = useState<UserRole>("USER");
  const [banType, changeBanType] = useState(true);
  const [banReason, updateBanReason] = useState("");

  const handleUpdateRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value.includes("USER")) {
      updateRole("USER");
    }
    if (value.includes("MOD")) {
      updateRole("MODERATOR");
    }
    if (value == "ADMIN") {
      updateRole("ADMIN");
    }
    if (value.includes("SUPER")) {
      updateRole("SUPER_ADMIN");
    }
  };

  return (
    isShown && (
      <div className="fixed top-0 left-0 z-30 bg-red-400/60 p-4 grid place-items-center min-h-screen w-screen">
        <div className="w-1/2 h-1/2 rounded-xl border-4 border-zinc-600  p-2 flex flex-col bg-background">
          <span
            className="w-full text-right p-2 grid justify-end"
            onClick={onClick}
          >
            <FiX className="w-8 h-8 text-xl font-bold text-white hover:text-red" />
          </span>
          <p className="capitalize font-semibold text-lg">
            {action_type} Confirmation
          </p>
          <p>
            You are about to {action_type} this user{" "}
            <span className="text-xl font-bold">{user.username}</span>.
          </p>
          <p>Proceed with caution</p>
          {action_type.includes("ban") && (
            <div className="flex flex-col">
              <label className="block my-3">Reason for Ban</label>
              <input
                type="text"
                className="w-3/4 rounded-lg block p-2 my-2 border-2 border-gray"
                onChange={(e) => updateBanReason(e.target.value)}
              />
              <div>
                <input
                  type="radio"
                  name="banType"
                  id="permanent"
                  onChange={(e) => changeBanType(false)}
                />{" "}
                <label>Temporary</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="banType"
                  id="temporary"
                  onChange={(e) => changeBanType(true)}
                />{" "}
                <label>Permanent</label>
              </div>
              <div className="flex justify-self-center justify-center self-center w-full md:gap-x-4 md:p-4">
                <button>Cancel</button>
                <button
                  className="flex gap-x-4"
                  onClick={() =>
                    banUser({
                      userId: user.id,
                      reason: "lorem",
                      permanent: banType,
                    })
                  }
                >
                  {isBanning && <SpinnerLoader className="shrink-0" />}
                  <span>{isBanning ? "Enacting Ban..." : "Confirm"}</span>
                </button>
              </div>
            </div>
          )}
          {action_type.includes("assign") && (
            <div className="flex flex-col">
              <select onChange={handleUpdateRole}>
                {roleTypes.map((role) => (
                  <option value={role} key={role}>
                    {role}
                  </option>
                ))}
              </select>
              <div className="flex justify-self-center justify-center self-center w-full md:gap-x-4 md:p-4">
                <button>Cancel</button>
                <button
                  className="gap-x-4 flex"
                  onClick={() =>
                    assignRole({
                      userId: user.id,
                      role: roleState,
                    })
                  }
                >
                  {isAssigning && <SpinnerLoader />}
                  <span>{isAssigning ? "Assigning Role..." : "Confirm"}</span>
                </button>
              </div>
            </div>
          )}
          {action_type.includes("delete") && (
            <div className="flex flex-col">
              <p>You are about to delete this user: </p>
              <div className="flex justify-self-center justify-center self-center w-full md:gap-x-4 md:p-4">
                <button>Cancel</button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="flex gap-x-4"
                >
                  {isDeleting && <SpinnerLoader className="shrink-0" />}
                  <span>{isDeleting ? "Deleting..." : "Confirm Deletion"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
