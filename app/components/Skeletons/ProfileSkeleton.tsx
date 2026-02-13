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

export default function ProfileSkeleton({
  hideHeader,
}: {
  hideHeader?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800">
      {!hideHeader && (
        <SkeletonPulse className="h-48 rounded-none bg-gray-100 dark:bg-neutral-800 opacity-50" />
      )}

      <div className="max-w-7xl mx-auto px-6 pt-5 pb-8">
        <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 rounded-md bg-white dark:bg-neutral-900 p-1 border border-gray-100 dark:border-neutral-800">
            <SkeletonPulse className="w-full h-full rounded-md" />
          </div>
          <div className="flex-1 pb-2 space-y-3">
            <div className="flex flex-col gap-2 items-center md:items-start">
              <SkeletonPulse className="h-8 w-64 rounded-md" />
              <SkeletonPulse className="h-4 w-32 rounded-md" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SkeletonPulse className="w-4 h-4 rounded-md shrink-0" />
              <SkeletonPulse className="h-3 w-40 rounded-md" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <SkeletonPulse className="w-6 h-6 rounded-md shrink-0" />
                <SkeletonPulse className="h-4 w-48 rounded-md" />
              </div>
              <div className="flex items-center gap-3">
                <SkeletonPulse className="w-6 h-6 rounded-md shrink-0" />
                <SkeletonPulse className="h-4 w-56 rounded-md" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-center md:justify-end gap-16 md:gap-24">
            <div className="text-center space-y-2">
              <SkeletonPulse className="h-8 w-12 mx-auto rounded-md" />
              <SkeletonPulse className="h-3 w-20 mx-auto rounded-md" />
            </div>
            <div className="text-center space-y-2">
              <SkeletonPulse className="h-8 w-12 mx-auto rounded-md" />
              <SkeletonPulse className="h-3 w-20 mx-auto rounded-md" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex border-b border-gray-100 dark:border-neutral-800 gap-8">
          <div className="h-12 w-32 relative">
            <SkeletonPulse className="absolute inset-x-0 top-0 bottom-4 rounded-md" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/30" />
          </div>
          <SkeletonPulse className="h-8 w-32 rounded-md" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="space-y-4"
            >
              <SkeletonPulse className="aspect-[2/3] rounded-md" />
              <div className="space-y-2">
                <SkeletonPulse className="h-4 w-full rounded-md" />
                <SkeletonPulse className="h-3 w-2/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
