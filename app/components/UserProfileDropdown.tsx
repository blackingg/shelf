"use client";
import { useState } from "react";
import { FiSettings, FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout } from "../store/authSlice";

export const UserProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const userFullName = user?.fullName || "";
  const userName = user?.username || "User";
  const userEmail = user?.email || "";
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

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    router.push("/app/auth/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-neutral-800 px-3 py-2 rounded-md transition-colors border border-transparent hover:border-gray-100 dark:hover:border-neutral-700/50"
      >
        <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-50 dark:bg-emerald-900/20 rounded-md overflow-hidden relative flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-bold border border-emerald-100 dark:border-emerald-800/50">
          {userAvatar &&
          (userAvatar.startsWith("/") || userAvatar.startsWith("http")) ? (
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
        <span className="hidden md:block text-sm font-bold text-gray-900 dark:text-neutral-100">
          @{userName}
        </span>
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
              <div className="p-5 border-b border-gray-100 dark:border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-md flex items-center justify-center bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-white font-bold text-lg shrink-0 overflow-hidden border border-gray-100 dark:border-neutral-700/50">
                    {userAvatar &&
                    (userAvatar.startsWith("/") ||
                      userAvatar.startsWith("http")) ? (
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
                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate leading-tight mb-1">
                      {userFullName}
                    </p>
                    <p className="text-[10px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 truncate opacity-60">
                      {userEmail}
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
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    View Profile
                  </span>
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left group"
                >
                  <FiSettings className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    Settings
                  </span>
                </button>
              </div>

              <div className="border-t border-gray-100 dark:border-neutral-800 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left group"
                >
                  <FiLogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-neutral-300 group-hover:text-red-600">
                    Logout
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
