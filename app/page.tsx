"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, selectIsAuthenticated } from "@/app/store";
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
import { LogoStacked } from "@/app/components/Logo";
import Link from "next/link";

export default function ShelfLanding() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
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
    { value: "1000+", label: "Active Users", icon: <FiUsers /> },
    { value: "5+", label: "Key Features", icon: <FiStar /> },
    { value: "100%", label: "Free to Start", icon: <FiZap /> },
  ];

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden font-onest">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full bg-white dark:bg-black border-b border-gray-100 dark:border-white/5 z-50 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <LogoStacked className="w-32 h-10 text-[#072c0b] dark:text-[#D0FDC2]" />
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => router.push("/app/discover")}
                className="px-6 py-2 bg-emerald-600 text-white rounded-sm text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Go to App
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push("/app/auth/login")}
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm font-medium px-4 py-2 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/app/auth/register")}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-sm text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 rounded-sm mb-8">
              <FiBook className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] uppercase font-medium tracking-widest text-emerald-700">
                Your Personal E-Library
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-medium mb-8 leading-none tracking-tighter text-gray-900 dark:text-white">
              Knowledge <br />
              for Students <br />
              <span className="text-emerald-600">& Readers</span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
              A cross-platform e-library combining academic resources and
              leisure reading. Organize, discover, and share.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-sm border border-gray-100 dark:border-white/5"
                >
                  <div className="text-emerald-600 w-4 h-4">{stat.icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {stat.value} {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/app/discover")}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-sm font-medium text-base hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Go to App</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/app/auth/register")}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-sm font-medium text-base hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Start Reading</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => router.push("/app/auth/login")}
                  className="px-8 py-4 bg-white dark:bg-black border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-sm font-medium text-base hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="relative bg-emerald-600 dark:bg-emerald-950 rounded-sm p-10 lg:p-12 border border-emerald-500/20">
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                  <div>
                    <LogoStacked className="w-28 h-8 mb-3 text-[#072c0b] dark:text-[#D0FDC2]" />
                    <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-100/60 font-medium">
                      Everywhere, Always
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: <FiFolder />,
                      title: "MTH 201 2021/2022",
                      count: "17 documents",
                    },
                    {
                      icon: <FiFolder />,
                      title: "Summer Break Novels",
                      count: "89 documents",
                    },
                    {
                      icon: <FiFolder />,
                      title: "Magazines",
                      count: "45 documents",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white/10 rounded-sm p-4 border border-white/10 hover:bg-white/15 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-white text-lg group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">
                            {item.title}
                          </div>
                          <div className="text-emerald-50 text-[10px] font-medium opacity-60">
                            {item.count}
                          </div>
                        </div>
                      </div>
                      <FiArrowRight className="text-white/40 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
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

      <section className="py-32 px-6 bg-white dark:bg-black border-t border-gray-50 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <div className="inline-block border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 rounded-sm mb-6">
              <span className="text-emerald-700 font-medium text-[10px] uppercase tracking-widest">
                WHY CHOOSE SHELF
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">
              Build your perfect digital library with powerful features
            </p>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-white/5 border-t border-b border-gray-50 dark:border-white/5">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 py-8 group transition-colors"
              >
                <div className="w-6 h-6 rounded-sm bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                  <FiCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-tight">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-32 px-6 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 rounded-sm mb-6">
              <span className="text-emerald-700 font-medium text-[10px] uppercase tracking-widest">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-black p-8 border border-gray-100 dark:border-white/5 rounded-sm hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center rounded-sm text-white mb-6">
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

      <section className="py-40 px-6 bg-emerald-600 dark:bg-emerald-900/10 border-t border-emerald-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block border border-white/20 bg-white/10 px-3 py-1 rounded-sm mb-8">
            <span className="text-white font-medium text-[10px] uppercase tracking-widest flex items-center space-x-2">
              <FiZap className="w-3 h-3" />
              <span>START YOUR JOURNEY TODAY</span>
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-medium text-white mb-8 tracking-tighter leading-tight">
            Ready to Transform <br />
            Your Reading?
          </h2>
          <p className="text-lg text-emerald-50 dark:text-emerald-200/60 max-w-xl mx-auto mb-12">
            Join thousands of students and readers already using Shelf to
            organize and discover amazing content.
          </p>

          <button
            onClick={() => (window.location.href = "/app/auth/register")}
            className="px-10 py-5 bg-white text-emerald-600 rounded-sm font-medium text-lg hover:bg-emerald-50 transition-colors inline-flex items-center space-x-2"
          >
            <span>Create Free Account</span>
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="bg-white dark:bg-black py-20 px-6 border-t border-gray-50 dark:border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center mb-6">
            <LogoStacked className="w-20 h-6 text-[#072c0b] dark:text-[#D0FDC2]" />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
            Building the future of digital libraries. Knowledge for students and
            readers, everywhere.
          </p>
          <div className="flex justify-center space-x-8 mb-8 text-xs font-medium uppercase tracking-widest text-gray-400">
            <Link
              href="/privacy"
              className="hover:text-emerald-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-emerald-600 transition-colors"
            >
              Terms
            </Link>
            <a
              href="https://x.com/shelfng_"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 transition-colors"
            >
              X (Twitter)
            </a>
            <a
              href="https://www.instagram.com/shelf_ng"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 transition-colors"
            >
              Instagram
            </a>
          </div>
          <p className="text-[10px] text-gray-400">
            © {new Date().getFullYear()} Shelf. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
