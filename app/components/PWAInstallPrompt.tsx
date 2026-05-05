"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiX, FiShare, FiDownload, FiPlusSquare } from "react-icons/fi";
import { usePWAInstall } from "@/app/helpers/usePWAInstall";
import { Logo } from "@/app/components/Logo";

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
            className="w-full max-w-sm bg-background rounded-md border border-gray-100 dark:border-white/10 overflow-hidden pointer-events-auto"
          >
            <div className="relative pt-8 pb-4 px-6 flex flex-col items-center">
              <button
                onClick={handleDismiss}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 relative mb-4 ">
                <Logo className="w-full h-full object-contain text-primary" />
              </div>

              <h3 className="text-xl font-medium text-foreground">
                Install Shelf
              </h3>
              <p className="mt-2 text-center text-gray-500 dark:text-neutral-400 text-sm leading-relaxed max-w-60">
                Add to your home screen for a faster, fullscreen experience.
              </p>
            </div>

            <div className="px-6 pb-8">
              {isIOS ? (
                <div className="bg-gray-50/50 dark:bg-white/5 rounded-md p-5 border border-gray-100 dark:border-white/10">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">
                    How to Setup
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-background shadow-sm flex items-center justify-center text-blue-500 border border-gray-100 dark:border-white/10">
                        <FiShare className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-neutral-300">
                        Tap{" "}
                        <span className="font-bold text-foreground">Share</span>{" "}
                        in your browser.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-background shadow-sm flex items-center justify-center text-primary border border-gray-100 dark:border-white/10">
                        <FiPlusSquare className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-neutral-300">
                        Select{" "}
                        <span className="font-bold text-foreground">
                          Add to Home Screen
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="w-full h-14 bg-primary hover:brightness-110 text-primary-foreground font-bold rounded-md transition-all shadow-[0_10px_25px_-4px_rgba(4,76,65,0.4)] flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <FiDownload className="w-5 h-5" />
                  <span>Install App</span>
                </button>
              )}
            </div>

            {/* Bottom Accent */}
            <div className="h-1.5 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
