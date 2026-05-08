"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/services";
import { motion } from "motion/react";
import {
  FiUsers,
  FiFolder,
  FiArrowRight,
  FiMonitor,
  FiSearch,
  FiBookmark,
  FiZap,
} from "react-icons/fi";
import { LogoStacked } from "@/app/components/Shared/Logo";
import Link from "next/link";

export default function ShelfLanding() {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const features = [
    {
      icon: <FiFolder className="w-5 h-5" />,
      title: "Public & Private Folders",
      description:
        "Keep notes to yourself or share with classmates and the Shelf community in one click.",
    },
    {
      icon: <FiUsers className="w-5 h-5" />,
      title: "Community Driven",
      description:
        "Discover what others are reading. Get recommendations from people with similar interests.",
    },
    {
      icon: <FiSearch className="w-5 h-5" />,
      title: "Smart Search",
      description:
        "Search books, users, and folders. Find what you need in seconds.",
    },
    {
      icon: <FiBookmark className="w-5 h-5" />,
      title: "Built-In Reader",
      description:
        "Highlight, bookmark, and pick up where you left off — no third-party apps needed.",
    },
    {
      icon: <FiMonitor className="w-5 h-5" />,
      title: "Cross-Platform",
      description:
        "Desktop, tablet, or phone — your library stays synced everywhere.",
    },
    {
      icon: <FiZap className="w-5 h-5" />,
      title: "Lightning Fast",
      description:
        "Instant loading even with large documents and deep folder structures.",
    },
  ];

  const benefits = [
    "Access thousands of academic materials across multiple genres",
    "Organise study notes and documents into clean, custom folders",
    "Donate materials and help build a stronger academic community",
    "Study anywhere with full cross-platform support",
    "Get recommendations based on your university, department, and interests",
  ];

  const folders = [
    {
      color: "bg-blue-500",
      title: "MTH 201 — 2021/2022",
      count: "17 documents",
    },
    {
      color: "bg-yellow-400",
      title: "Summer Break Novels",
      count: "89 documents",
    },
    {
      color: "bg-purple-500",
      title: "Magazines & Research",
      count: "45 documents",
    },
  ];

  return (
    <>
      <section className="relative min-h-[calc(100vh-64px)] flex items-center px-6 py-16 border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-sm mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] uppercase font-medium tracking-widest text-gray-500 dark:text-gray-400">
                Your personal e-library
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-medium leading-[0.95] tracking-tighter text-gray-900 dark:text-white mb-6">
              Knowledge
              <br />
              for Students <br />
              <span className="text-primary">& Readers</span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mb-10">
              A cross-platform library for students and readers. Organise
              academic resources, discover new reading, and share with your
              community.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() =>
                  router.push(isAuthenticated ? "/discover" : "/auth/register")
                }
                className="px-7 py-3.5 bg-primary text-primary-foreground rounded-sm font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <span>{isAuthenticated ? "Go to App" : "Start Reading"}</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => router.push("/auth/login")}
                  className="px-7 py-3.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-gray-900 dark:text-white rounded-sm font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            <div className="flex items-center gap-0 divide-x divide-gray-200 dark:divide-white/10">
              {[
                { value: "50k+", label: "Resources" },
                { value: "", label: "Customizable Folders" },
                { value: "100%", label: "Community" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-0.5 ${i === 0 ? "pr-6" : "px-6"}`}
                >
                  <span className="text-2xl font-medium tracking-tight text-gray-900 dark:text-white leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative bg-white dark:bg-neutral-900 rounded-sm p-1 border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className="bg-gray-100 dark:bg-white/5 p-8 lg:p-10 border border-gray-100 dark:border-white/5 rounded-sm">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <LogoStacked className="w-24 h-7 mb-2 text-primary" />
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                      Everywhere, Always
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {folders.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white dark:bg-black px-4 py-3.5 border border-gray-100 dark:border-white/10 rounded-sm group cursor-default hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${item.color}`}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                            {item.count}
                          </div>
                        </div>
                      </div>
                      <FiArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-white/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white dark:bg-black border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-sm mb-5">
              <FiZap className="w-3 h-3 text-primary" />
              <span className="text-[10px] uppercase font-medium tracking-widest text-gray-500 dark:text-gray-400">
                Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 dark:text-white leading-[0.95] mb-4">
              Built for how you
              <br />
              actually study
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-base leading-relaxed">
              Everything you need to organise, discover, and read — without the
              clutter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 border border-gray-100 dark:border-white/10">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-8 border-r border-b border-gray-100 dark:border-white/10 last:border-r-0 [&:nth-child(3n)]:border-r-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors group"
              >
                <div className="text-primary mb-5">{feature.icon}</div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white dark:bg-black border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-sm mb-6">
              <span className="text-[10px] uppercase font-medium tracking-widest text-gray-500 dark:text-gray-400">
                Why Shelf
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-gray-900 dark:text-white leading-[0.95] mb-5">
              Everything you
              <br />
              need, nothing
              <br />
              you don't
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-xs">
              Shelf strips away the noise so the content takes centre stage.
            </p>
          </div>

          <ul className="divide-y divide-gray-100 dark:divide-white/10 border-y border-gray-100 dark:border-white/10">
            {benefits.map((benefit, i) => (
              <li
                key={i}
                className="flex items-start gap-4 py-6"
              >
                <div className="w-5 h-5 rounded-full border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <span className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 leading-snug tracking-tight">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-36 px-6 bg-white dark:bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[10px] uppercase font-medium tracking-widest text-gray-500 dark:text-gray-400">
              Free to join
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-medium tracking-tighter text-gray-900 dark:text-white leading-[0.95] mb-6">
            Ready to build
            <br />
            your library?
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-sm mx-auto mb-10">
            Join thousands of students and readers already on Shelf.
          </p>

          <button
            onClick={() => router.push("/auth/register")}
            className="px-10 py-4 bg-primary text-primary-foreground rounded-sm font-medium text-base hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Create Free Account
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </>
  );
}
