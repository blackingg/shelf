"use client";
import React, { useState, useEffect } from "react";
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
import { BiLibrary } from "react-icons/bi";
import Image from "next/image";

export default function ShelfLanding() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-emerald-50 overflow-hidden">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
        className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 z-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg">
                <Image
                  width={20}
                  height={20}
                  src="/logo.png"
                  alt="Shelf Logo"
                  className="text-white"
                />
              </div>
              <span className="text-2xl font-bold text-black">Shelf</span>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => (window.location.href = "/app/auth/login")}
                className="text-gray-700 hover:text-emerald-700 font-medium transition-colors px-4 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => (window.location.href = "/app/auth/register")}
                className="px-6 py-2.5 bg-linear-to-r from-emerald-600 to-emerald-700 text-white rounded-full font-medium shadow-lg shadow-emerald-500/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center space-x-2 bg-linear-to-r from-emerald-100 to-teal-100 px-5 py-2.5 rounded-full mb-8 border border-emerald-200"
            >
              <FiBook className="w-5 h-5 text-emerald-700" />
              <span className="text-sm font-semibold text-emerald-800">
                Your Personal E-Library
              </span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block text-gray-900">Knowledge</span>
              <span className="block text-gray-900">for Students</span>
              <span className="block bg-linear-to-r from-emerald-600 via-emerald-700 to-teal-600 bg-clip-text text-transparent">
                & Readers
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              A cross-platform e-library combining academic resources and
              leisure reading. Organize, discover, and share with personalized
              recommendations.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-200 shadow-sm"
                >
                  <div className="text-emerald-600 text-2xl">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <motion.button
                onClick={() => (window.location.href = "/app/auth/register")}
                className="px-8 py-4 bg-linear-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Reading Free</span>
                <FiArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={() => (window.location.href = "/app/auth/login")}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 rounded-2xl font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05, y: -2, borderColor: "#059669" }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            style={{
              rotateX: mousePosition.y,
              rotateY: mousePosition.x,
            }}
          >
            <motion.div
              className="relative bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-900 rounded-[2rem] p-12 shadow-2xl border border-emerald-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent rounded-[2rem]" />

              <motion.div
                className="absolute top-6 right-6 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                  <Image
                    width={40}
                    height={40}
                    src="/logo.png"
                    alt="Shelf Logo"
                    className="text-white rounded-lg"
                  />
                  <div>
                    <div className="text-white font-bold text-lg">
                      Your Library
                    </div>
                    <div className="text-emerald-200 text-sm">
                      Everywhere, Always
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
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
                      className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-white text-xl">{item.icon}</div>
                        <div>
                          <div className="text-white font-semibold">
                            {item.title}
                          </div>
                          <div className="text-emerald-200 text-sm">
                            {item.count}
                          </div>
                        </div>
                      </div>
                      <FiArrowRight className="text-white/60" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-6 -left-6 bg-linear-to-br from-yellow-400 to-orange-500 w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center z-50"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <FiStar className="w-10 h-10 text-white" />
            </motion.div>

            <motion.div
              className="absolute -bottom-6 -right-6 bg-linear-to-br from-blue-400 to-indigo-500 w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center z-50"
              animate={{
                y: [0, 20, 0],
                rotate: [0, -10, 0],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <FiZap className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2"
          >
            <span className="text-sm text-gray-500">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
              <motion.div
                className="w-1.5 h-3 bg-emerald-600 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block bg-emerald-100 px-4 py-2 rounded-full mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-emerald-700 font-semibold text-sm">
                WHY CHOOSE SHELF
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Build your perfect digital library with powerful features
            </p>
          </motion.div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 bg-linear-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="bg-emerald-600 rounded-full p-2 mt-1 shadow-lg">
                  <FiCheck className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg text-gray-800 font-medium">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-32 px-6 relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block bg-emerald-100 px-4 py-2 rounded-full mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-emerald-700 font-semibold text-sm">
                POWERFUL FEATURES
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Built for Students & Readers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From textbooks to novels, magazines to comics, organized the way
              you learn and read
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  className="relative h-full bg-white rounded-3xl p-8 border border-gray-200 overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative z-10">
                    <div className="inline-flex p-4 bg-linear-to-br from-emerald-600 to-emerald-700 rounded-2xl mb-6 text-white shadow-lg">
                      {feature.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          />
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{ y: y1 }}
          >
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-0 w-full h-full"
            style={{ y: y2 }}
          >
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl" />
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-emerald-800/50 backdrop-blur-sm px-5 py-2 rounded-full mb-8 border border-emerald-700"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiZap className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-200 font-semibold text-sm">
                START YOUR JOURNEY TODAY
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Ready to Transform
              <br />
              Your Reading?
            </h2>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-2xl mx-auto mb-12">
              Join thousands of students and readers already using Shelf to
              organize and discover amazing content
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => (window.location.href = "/app/auth/register")}
                className="px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-lg shadow-2xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Create Free Account</span>
                <FiArrowRight className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-linear-to-br from-emerald-950 via-emerald-900 to-gray-900 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-emerald-700 p-2.5 rounded-xl">
              <BiLibrary className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Shelf</span>
          </div>
          <p className="text-emerald-200 leading-relaxed mb-6">
            Building the future of digital libraries. Knowledge for students and
            readers, everywhere.
          </p>
          <p className="text-emerald-300 text-sm">
            © {new Date().getFullYear()} Shelf. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
