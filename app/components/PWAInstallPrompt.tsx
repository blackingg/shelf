"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiX, FiShare, FiDownload, FiPlusSquare } from "react-icons/fi";
import { usePWAInstall } from "@/app/helpers/usePWAInstall";
import Image from "next/image";

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
    if (!isDismissed && !isStandalone && (canInstall || isIOS)) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isDismissed, isStandalone, canInstall, isIOS]);

  const handleInstallClick = () => {
    if (canInstall) {
      promptInstall();
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] md:hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto"
        />

        <div className="absolute inset-x-0 bottom-0 p-4 pb-[calc(2rem+env(safe-area-inset-bottom))] flex justify-center">
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-neutral-100 dark:border-neutral-800 overflow-hidden pointer-events-auto"
          >
            <div className="relative pt-8 pb-4 px-6 flex flex-col items-center">
              <button
                onClick={handleDismiss}
                className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 relative mb-4 bg-primary/5 rounded-3xl flex items-center justify-center p-3 shadow-inner border border-primary/10">
                <Image
                  src="/logo.png"
                  alt="Shelf Logo"
                  width={60}
                  height={60}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              <h3 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-br from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400">
                Install Shelf
              </h3>
              <p className="mt-2 text-center text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-60">
                Add to your home screen for a faster, fullscreen experience.
              </p>
            </div>

            <div className="px-6 pb-8">
              {isIOS ? (
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl p-5 border border-neutral-100 dark:border-neutral-800">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4 opacity-70">
                    How to Setup
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center text-blue-500 border border-neutral-100 dark:border-neutral-700">
                        <FiShare className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300">
                        Tap{" "}
                        <span className="font-bold text-neutral-900 dark:text-white">
                          Share
                        </span>{" "}
                        in Safari
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center text-primary border border-neutral-100 dark:border-neutral-700">
                        <FiPlusSquare className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300">
                        Select{" "}
                        <span className="font-bold text-neutral-900 dark:text-white">
                          Add to Home Screen
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="w-full h-14 bg-primary hover:brightness-110 text-white font-bold rounded-2xl transition-all shadow-[0_10px_25px_-4px_rgba(4,76,65,0.4)] flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <FiDownload className="w-5 h-5" />
                  <span>Install App</span>
                </button>
              )}
            </div>

            {/* Bottom Accent */}
            <div className="h-1.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
