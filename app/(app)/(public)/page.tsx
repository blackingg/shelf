"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/services";
import { motion, useScroll, useTransform } from "motion/react";
import {
  FiBook,
  FiUsers,
  FiFolder,
  FiArrowRight,
  FiMonitor,
  FiSearch,
  FiBookmark,
  FiCheck,
  FiStar,
  FiZap,
} from "react-icons/fi";
import { LogoStacked } from "@/app/components/Shared/Logo";
import Link from "next/link";

export default function ShelfLanding() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const features = [
    {
      icon: <FiFolder className="w-7 h-7" />,
      title: "Public & Private Folders",
      description:
        "Organize your documents with ease. Keep folders private or share them with classmates, friends, or the Shelf community.",
    },
    {
      icon: <FiUsers className="w-7 h-7" />,
      title: "Community Driven",
      description:
        "Discover what others are reading. Get recommendations from classmates, departments, and users with similar interests.",
    },
    {
      icon: <FiSearch className="w-7 h-7" />,
      title: "Smart Search",
      description:
        "Search instantly by course, topic, genre, or keywords. Find the exact folders and documents you need in seconds.",
    },
    {
      icon: <FiBookmark className="w-7 h-7" />,
      title: "Built-In Reader",
      description:
        "Read documents directly on Shelf with our integrated reader. Highlight, bookmark, and pick up where you left off.",
    },
    {
      icon: <FiMonitor className="w-7 h-7" />,
      title: "Cross-Platform",
      description:
        "Access Shelf anywhere — on desktop, tablet, or phone. Your library stays synced across all your devices.",
    },
    {
      icon: <FiZap className="w-7 h-7" />,
      title: "Lightning Fast",
      description:
        "Enjoy smooth performance and instant loading, even with large documents and folders.",
    },
  ];

  const benefits = [
    "Access thousands of academic materials and books across multiple genres",
    "Organize your study notes and documents into clean, custom folders",
    "Donate materials and help build a stronger academic community",
    "Study anywhere and anytime with full cross-platform support",
    "Receive personalized recommendations based on your university, department, and interests",
  ];

  const stats = [
    { value: "50k+", label: "Resources", icon: <FiBook /> },
    { value: "", label: "Customizable Folders", icon: <FiFolder /> },
    { value: "100%", label: "Community Driven", icon: <FiUsers /> },
  ];

  const { isAuthenticated } = useUser();
  const router = useRouter();

  return (
    <>
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center pt-8 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-sm mb-8">
              <FiBook className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] uppercase font-medium tracking-widest text-primary">
                Your Personal E-Library
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-medium mb-8 leading-[0.9] tracking-tighter text-gray-900 dark:text-white">
              Knowledge <br />
              for Students <br />
              <span className="text-primary">& Readers</span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              A cross-platform e-library combining academic resources and
              leisure reading. Organize, discover, and share.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-sm border border-gray-100 dark:border-white/10"
                >
                  <div className="text-primary w-4 h-4">{stat.icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {stat.value} {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  router.push(isAuthenticated ? "/discover" : "/auth/register")
                }
                className="px-8 py-4 bg-primary text-primary-foreground rounded-sm font-medium text-base hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <span>{isAuthenticated ? "Go to App" : "Start Reading"}</span>
                <FiArrowRight className="w-5 h-5" />
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => router.push("/auth/login")}
                  className="px-8 py-4 bg-white dark:bg-black border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white rounded-sm font-medium text-base hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
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

                <div className="space-y-2">
                  {[
                    {
                      color: "bg-blue-500",
                      title: "MTH 201 2021/2022",
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
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white dark:bg-black rounded-sm p-4 border border-gray-100 dark:border-white/10 transition-colors group cursor-default"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                        <div>
                          <div className="text-gray-900 dark:text-white text-sm font-medium">
                            {item.title}
                          </div>
                          <div className="text-gray-400 text-[10px] font-medium">
                            {item.count}
                          </div>
                        </div>
                      </div>
                      <FiArrowRight className="text-gray-300 w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ opacity }}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Scroll
            </span>
            <div className="w-px h-12 bg-gray-100 dark:bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-emerald-500"
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-24 md:py-40 px-6 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="inline-block border border-primary/20 bg-primary/5 px-3 py-1 rounded-sm mb-6">
              <span className="text-primary font-medium text-[10px] uppercase tracking-widest">
                WHY CHOOSE SHELF
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-medium text-gray-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
              Everything <br /> You Need
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-sm">
              Build your perfect digital library with features designed for
              modern academic life.
            </p>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="py-10 first:pt-0 last:pb-0 flex items-start space-x-6 group transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-1 border border-primary/20 rounded-full group-hover:border-primary transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <p className="text-lg md:text-2xl text-gray-800 dark:text-gray-200 font-medium leading-tight tracking-tight">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-32 px-6 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block border border-primary/20 bg-primary/5 px-3 py-1 rounded-sm mb-6">
              <span className="text-primary font-medium text-[10px] uppercase tracking-widest">
                POWERFUL FEATURES
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6 tracking-tight">
              Built for Students & Readers
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              From textbooks to novels, magazines to comics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-black p-8 border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
              >
                <div className="w-10 h-10 text-primary mb-6">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
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

      <section className="py-40 px-6 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block border border-primary/20 bg-primary/5 px-3 py-1 rounded-sm mb-8">
            <span className="text-primary font-medium text-[10px] uppercase tracking-widest flex items-center space-x-2">
              <FiZap className="w-3 h-3" />
              <span>START YOUR JOURNEY TODAY</span>
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-medium text-gray-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
            Ready to Transform <br />
            Your Reading?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-12">
            Join thousands of students and readers already using Shelf to
            organize and discover amazing content.
          </p>

          <button
            onClick={() => (window.location.href = "/auth/register")}
            className="px-10 py-5 bg-primary text-primary-foreground rounded-sm font-medium text-lg hover:opacity-90 transition-opacity inline-flex items-center space-x-2"
          >
            <span>Create Free Account</span>
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </>
  );
}
