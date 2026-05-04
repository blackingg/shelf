"use client";
import { useState } from "react";
import {
  FiSettings,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch } from "react-redux";
import { useUser, useAuthActions } from "@/app/services";
import { ConfirmModal } from "./ConfirmModal";

export const UserProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout: performLogout } = useAuthActions();
  const { me: user, isAuthenticated, isHydrated } = useUser();

  if (!isHydrated) return null;

  const userFullName = user?.fullName || "";
  const userName = user?.username || "User";
  const userAvatar = user?.avatar || null;

  const router = useRouter();

  const handleViewProfile = () => {
    setIsOpen(false);
    router.push(`/app/profile/${userName}`);
  };

  const handleSettings = () => {
    setIsOpen(false);
    router.push("/app/settings/profile");
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    performLogout();
    setShowLogoutModal(false);
  };

  const handleLogin = () => {
    setIsOpen(false);
    router.push("/app/auth/login");
  };

  const handleRegister = () => {
    setIsOpen(false);
    router.push("/app/auth/register");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors border border-transparent hover:bg-gray-50 dark:hover:bg-neutral-800 hover:border-gray-100 dark:hover:border-neutral-700/50"
      >
        {isAuthenticated && user ? (
          <>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-50 dark:bg-emerald-900/20 rounded-md overflow-hidden relative flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-bold border border-emerald-100 dark:border-emerald-800/50">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                userName.charAt(0).toUpperCase() ||
                userFullName.charAt(0).toUpperCase()
              )}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-neutral-100">
              @{userName}
            </span>
          </>
        ) : (
          <>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gray-100 dark:bg-white/5 rounded-md overflow-hidden relative flex items-center justify-center text-gray-500 dark:text-neutral-300 text-sm border border-gray-200 dark:border-white/10">
              <FiUser className="w-4 h-4" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-neutral-100">
              Sign in
            </span>
          </>
        )}
        <FiChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-neutral-800 overflow-hidden z-50 text-left"
            >
              {isAuthenticated && user ? (
                <>
                  <div className="p-5 border-b border-gray-100 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white font-medium text-base shrink-0 overflow-hidden border border-gray-100 dark:border-white/10">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          userName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate leading-tight mb-0.5">
                          {userFullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          @{userName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={handleViewProfile}
                      className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left group"
                    >
                      <FiUser className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-600 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white">
                        View Profile
                      </span>
                    </button>
                    <button
                      onClick={handleSettings}
                      className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left group"
                    >
                      <FiSettings className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-600 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white">
                        Settings
                      </span>
                    </button>
                  </div>

                  <div className="border-t border-gray-100 dark:border-neutral-800 py-2">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full px-5 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left group"
                    >
                      <FiLogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                      <span className="text-sm font-medium text-gray-600 dark:text-neutral-300 group-hover:text-red-600">
                        Logout
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-5 border-b border-gray-100 dark:border-neutral-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                      Welcome to Shelf
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Sign in to your account or create a new one.
                    </p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={handleLogin}
                      className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group"
                    >
                      <FiLogIn className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white">
                        Log in
                      </span>
                    </button>
                    <button
                      onClick={handleRegister}
                      className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group"
                    >
                      <FiUserPlus className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                        Create account
                      </span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to log out of your session?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
};
