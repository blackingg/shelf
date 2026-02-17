"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiX, FiShare, FiDownload, FiPlusSquare } from "react-icons/fi";
import { usePWAInstall } from "@/app/helpers/usePWAInstall";

export const PWAInstallPrompt: React.FC = () => {
  const {
    canInstall,
    isStandalone,
    isDismissed,
    isIOS,
    promptInstall,
    dismissPrompt,
  } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show prompt if not dismissed, not standalone, and installation is possible (or on iOS)
    if (!isDismissed && !isStandalone && (canInstall || isIOS)) {
      setIsVisible(true);
    }
  }, [isDismissed, isStandalone, canInstall, isIOS]);

  const handleInstallClick = () => {
    if (canInstall) {
      promptInstall();
    } else if (isIOS) {
      // iOS doesn't support install prompt, show instructions.
      // Instructions are handled inline within the component render.
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 p-4 shadow-none md:hidden safe-area-bottom"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
              Add Shelf to Home Screen
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
              Install Shelf for a faster, fullscreen experience and offline
              access.
            </p>

            {isIOS && (
              <div className="mt-3 text-xs text-gray-600 dark:text-neutral-300 flex items-center gap-1 flex-wrap">
                <span>Tap</span>
                <FiShare className="inline w-4 h-4 text-blue-500" />
                <span>Share, then scroll down and tap</span>
                <span className="font-medium whitespace-nowrap inline-flex items-center gap-1 bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded">
                  <FiPlusSquare className="w-3.5 h-3.5" />
                  Add to Home Screen
                </span>
                .
              </div>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 transition-colors"
            aria-label="Dismiss"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {!isIOS && (
          <button
            onClick={handleInstallClick}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-2.5 rounded-md transition-colors flex items-center justify-center space-x-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>Install Shelf</span>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
