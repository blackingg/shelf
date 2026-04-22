"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { FiLogIn, FiUserPlus, FiX, FiBookOpen } from "react-icons/fi";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional message to display. Defaults to a generic prompt. */
  message?: string;
  /** Optional redirect path after login. Defaults to current page. */
  redirectPath?: string;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  message = "Sign in to access this feature, bookmark resources, and build your library.",
  redirectPath,
}) => {
  const router = useRouter();

  const handleLogin = () => {
    const redirect = redirectPath
      ? `?redirect=${encodeURIComponent(redirectPath)}`
      : "";
    router.push(`/app/auth/login${redirect}`);
    onClose();
  };

  const handleRegister = () => {
    router.push("/app/auth/register");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="auth-prompt-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            key="auth-prompt-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-neutral-800 overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors z-10"
                aria-label="Close"
              >
                <FiX className="w-4 h-4 text-gray-400" />
              </button>

              {/* Content */}
              <div className="px-8 pt-10 pb-6 text-center">
                <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-md flex items-center justify-center mx-auto mb-5 border border-gray-100 dark:border-white/10">
                  <FiBookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                </div>

                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Sign in to continue
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="px-8 pb-10 space-y-2.5">
                <button
                  onClick={handleLogin}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-md flex items-center justify-center gap-2.5 transition-colors active:scale-[0.98]"
                >
                  <FiLogIn className="w-4 h-4" />
                  Log in
                </button>

                <button
                  onClick={handleRegister}
                  className="w-full h-11 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-neutral-200 font-medium text-sm rounded-md flex items-center justify-center gap-2.5 transition-colors border border-gray-200 dark:border-white/10 active:scale-[0.98]"
                >
                  <FiUserPlus className="w-4 h-4" />
                  Create account
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
