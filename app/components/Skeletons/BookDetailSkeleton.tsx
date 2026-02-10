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

export default function BookDetailSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900 overflow-y-auto">
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-800 shrink-0">
          <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
                <SkeletonPulse className="aspect-2/3 rounded-3xl" />
              </div>

              <div className="flex-1 space-y-6">
                <SkeletonPulse className="h-6 w-24 rounded-full" />
                <SkeletonPulse className="h-12 w-3/4 rounded-xl" />
                <SkeletonPulse className="h-8 w-1/2 rounded-lg" />

                <div className="flex flex-wrap items-center gap-8 py-4">
                  <div className="space-y-2">
                    <SkeletonPulse className="h-3 w-12" />
                    <SkeletonPulse className="h-8 w-32" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonPulse className="h-3 w-12" />
                    <SkeletonPulse className="h-8 w-32" />
                  </div>
                </div>

                <div className="space-y-2">
                  <SkeletonPulse className="h-3 w-24" />
                  <SkeletonPulse className="h-10 w-48" />
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <SkeletonPulse className="h-14 w-full sm:w-48 rounded-2xl" />
                  <SkeletonPulse className="h-14 w-full sm:w-48 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 w-full">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              <section className="space-y-4">
                <SkeletonPulse className="h-8 w-32" />
                <div className="space-y-2">
                  <SkeletonPulse className="h-4 w-full" />
                  <SkeletonPulse className="h-4 w-full" />
                  <SkeletonPulse className="h-4 w-full" />
                  <SkeletonPulse className="h-4 w-2/3" />
                </div>
              </section>

              <section className="bg-white dark:bg-neutral-800 p-8 md:p-12 rounded-[2.5rem] border border-gray-200 dark:border-neutral-700 shadow-xl space-y-6">
                <div className="space-y-2">
                  <SkeletonPulse className="h-10 w-64" />
                  <SkeletonPulse className="h-4 w-48" />
                </div>
                <div className="space-y-8 pt-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-4"
                    >
                      <SkeletonPulse className="w-12 h-12 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <SkeletonPulse className="h-4 w-32" />
                        <SkeletonPulse className="h-3 w-24" />
                        <SkeletonPulse className="h-16 w-full rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-10">
              <section className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-gray-200 dark:border-neutral-700 space-y-6">
                <SkeletonPulse className="h-3 w-20" />
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="space-y-2"
                    >
                      <SkeletonPulse className="h-2 w-16" />
                      <div className="flex items-center gap-2">
                        {i === 1 && (
                          <SkeletonPulse className="w-6 h-6 rounded-full" />
                        )}
                        <SkeletonPulse className="h-5 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <SkeletonPulse className="h-3 w-32" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 p-3 border border-gray-100 dark:border-neutral-800 rounded-2xl"
                    >
                      <SkeletonPulse className="w-14 h-20 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <SkeletonPulse className="h-4 w-full" />
                        <SkeletonPulse className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
