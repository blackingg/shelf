"use client";
import React from "react";
import { motion } from "motion/react";

const SkeletonPulse = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-gray-200 dark:bg-neutral-800 rounded ${className}`}
  >
    <motion.div
      className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
      animate={{ x: ["-100%", "100%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

export default function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
      <SkeletonPulse className="h-48 rounded-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-8">
        <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="w-32 h-32 rounded-2xl bg-white dark:bg-neutral-800 p-1 shadow-xl">
            <SkeletonPulse className="w-full h-full rounded-xl" />
          </div>
          <div className="flex-1 pb-2 space-y-2">
            <SkeletonPulse className="h-8 w-64 rounded-lg" />
            <SkeletonPulse className="h-4 w-32 rounded-md" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <SkeletonPulse className="w-4 h-4 rounded-full shrink-0" />
              <SkeletonPulse className="h-4 w-40" />
            </div>
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-2">
                <SkeletonPulse className="w-4 h-4 rounded-full shrink-0" />
                <SkeletonPulse className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <SkeletonPulse className="w-4 h-4 rounded-full shrink-0" />
                <SkeletonPulse className="h-4 w-32" />
              </div>
            </div>
          </div>

          <div className="flex gap-8 items-center justify-start md:justify-end md:col-span-2">
            <div className="text-center space-y-2">
              <SkeletonPulse className="h-8 w-12 mx-auto" />
              <SkeletonPulse className="h-3 w-16 mx-auto" />
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-neutral-800" />
            <div className="text-center space-y-2">
              <SkeletonPulse className="h-8 w-12 mx-auto" />
              <SkeletonPulse className="h-3 w-16 mx-auto" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex border-b border-gray-200 dark:border-neutral-800 gap-8">
          <div className="h-12 w-32 relative">
            <SkeletonPulse className="absolute inset-0 rounded-none" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          </div>
          <SkeletonPulse className="h-12 w-32 rounded-none" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="space-y-3"
            >
              <SkeletonPulse className="aspect-[2/3] rounded-2xl" />
              <div className="space-y-2">
                <SkeletonPulse className="h-4 w-3/4" />
                <SkeletonPulse className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
