"use client";
import { motion, AnimatePresence } from "motion/react";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDanger?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  isDanger = false,
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-screen overflow-hidden bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-neutral-900 rounded-lg p-8 border border-gray-200 dark:border-neutral-800 z-50"
          >
            <div className="flex items-center space-x-4 mb-8">
              {isDanger && (
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-md flex items-center justify-center text-red-600 dark:text-red-400 font-bold shrink-0 border border-red-100 dark:border-red-900/50">
                  <FiAlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
            </div>

            <div className="text-gray-600 dark:text-neutral-400 mb-10 text-sm leading-relaxed">
              {message}
              {isDanger && (
                <p className="mt-2 text-red-500 dark:text-red-400/80 font-medium">
                  This action cannot be undone.
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 font-bold text-xs uppercase tracking-widest rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors border border-gray-100 dark:border-neutral-700"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-3 text-white font-bold text-xs uppercase tracking-widest rounded-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDanger
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isLoading ? <span>Wait...</span> : <span>{confirmText}</span>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
