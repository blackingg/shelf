"use client";
import { useState } from "react";
import { Button } from "@/app/components/Form/Button";
import { FiMail, FiLock } from "react-icons/fi";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import { useSelector } from "react-redux";
import {
  useUpdateMeMutation,
  useChangePasswordMutation,
  useDeleteMeMutation,
} from "@/app/store/api/usersApi";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";
import { useRouter } from "next/navigation";
import { selectCurrentUser, logout } from "@/app/store/authSlice";
import { useAppDispatch } from "@/app/store/store";

export default function AccountSettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { addNotification } = useNotifications();
  const user = useSelector(selectCurrentUser);
  const [updateMe, { isLoading: isUpdatingEmail }] = useUpdateMeMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [deleteMe, { isLoading: isDeletingAccount }] = useDeleteMeMutation();

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [email, setEmail] = useState(user?.email || "");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleStartEditingEmail = () => {
    setEmail(user?.email || "");
    setIsEditingEmail(true);
  };

  const handleSaveEmail = async () => {
    try {
      await updateMe({ email }).unwrap();
      addNotification("success", "Email updated successfully!");
      setIsEditingEmail(false);
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to update email"),
      );
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification("error", "New passwords do not match");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      addNotification("success", "Password changed successfully!");
      setIsEditingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to change password"),
      );
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteMe().unwrap();
      addNotification("success", "Account deleted successfully");
      dispatch(logout());
      router.push("/app/auth/login");
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to delete account"),
      );
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact Info
          </h3>
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-4 md:p-6">
            {isEditingEmail ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                    <FiMail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditingEmail(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    onClick={handleSaveEmail}
                    isLoading={isUpdatingEmail}
                    className="w-auto py-2 px-6 text-sm"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                    <FiMail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Email Address
                    </div>
                    <div className="text-sm text-gray-500 dark:text-neutral-400">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleStartEditingEmail}
                  className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-md transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Security
          </h3>
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-4 md:p-6">
            {isEditingPassword ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-full mt-1">
                    <FiLock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors placeholder-gray-400 dark:placeholder-neutral-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors placeholder-gray-400 dark:placeholder-neutral-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors placeholder-gray-400 dark:placeholder-neutral-600"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditingPassword(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    onClick={handleSavePassword}
                    isLoading={isChangingPassword}
                    className="w-auto py-2 px-6 text-sm"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                    <FiLock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Password
                    </div>
                    <div className="text-sm text-gray-500 dark:text-neutral-400">
                      Last changed 3 months ago
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-md transition-colors"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-500 mb-4">
            Danger Zone
          </h3>
          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="font-medium text-red-900 dark:text-red-400">
                Delete Account
              </div>
              <div className="text-sm text-red-600/80 dark:text-red-400/70 mt-1">
                Permanently remove your account and all associated data.
              </div>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isDeletingAccount}
              className="px-5 py-2.5 bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors shadow-sm whitespace-nowrap text-sm disabled:opacity-50"
            >
              {isDeletingAccount ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </section>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action is permanent and will remove all your data, including folders."
        confirmText="Delete Account"
        isDanger={true}
        isLoading={isDeletingAccount}
      />
    </div>
  );
}
