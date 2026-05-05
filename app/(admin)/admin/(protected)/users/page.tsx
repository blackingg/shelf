export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          User Management
        </h2>
        <p className="text-gray-500 dark:text-neutral-400 font-medium">
          Manage system users, roles, and permissions.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
            {/* Icon placeholder */}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            No users to display
          </h3>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            The user management module is currently under construction.
          </p>
        </div>
      </div>
    </div>
  );
}
