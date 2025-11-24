"use client";
import { useState } from "react";
import { FiSettings, FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

export const UserProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userName = "Balogun";
  const userEmail = "balogun@example.com";
  const userAvatar = "/avatar.jpg";

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    setIsOpen(false);
  };

  const handleSettings = () => {
    console.log("Settings clicked");
    setIsOpen(false);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
      >
        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden relative">
          <Image
            src={userAvatar}
            alt="User"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <span className=" hidden md:block font-medium text-gray-900">{userName}</span>
        <FiChevronDown className="w-4 h-4 text-gray-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <button
                  onClick={handleEditProfile}
                  className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <FiUser className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Edit Profile
                  </span>
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <FiSettings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Settings
                  </span>
                </button>
              </div>
              <div className="border-t border-gray-200 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-red-50 transition-colors text-left group"
                >
                  <FiLogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
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
