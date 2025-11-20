"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import {
  FiBook,
  FiUsers,
  FiFolder,
  FiArrowRight,
  FiMonitor,
  FiSearch,
  FiBookmark,
  FiTwitter,
  FiZap,
  FiStar,
  FiCheckCircle,
  FiAlertCircle,
  FiGift,
  FiMessageCircle,
  FiShield,
} from "react-icons/fi";
import { BiLibrary } from "react-icons/bi";
import { SiDiscord } from "react-icons/si";
import { RiInstagramLine } from "react-icons/ri";

export default function ShelfLanding() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState("0");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(useTransform(scrollY, [0, 300], [0, 50]), springConfig);

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

  const fetchWaitlistCount = async () => {
    try {
      const response = await fetch("/api/waitlist");
      if (response.ok) {
        const data = await response.json();
        setWaitlistCount(data.totalSignups || 0);
      }
    } catch (error) {
      console.error("Error fetching waitlist count:", error);
    }
  };

  useEffect(() => {
    fetchWaitlistCount();
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setIsDuplicate(false);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.alreadyExists) {
          setIsDuplicate(true);
          setIsSubmitted(true);
        } else {
          setIsSubmitted(true);
          setWaitlistCount(data.totalSignups || waitlistCount + 1);
        }
      } else {
        console.error("Failed to submit email:", data.error);
      }
    } catch (error) {
      console.error("Error submitting email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  type feature = {
    icon: any;
    title: string;
    description: string;
  };

  const features: feature[] = [
    {
      icon: <FiFolder className="w-7 h-7" />,
      title: "Public & Private Folders",
      description:
        "Store your documents and reading materials safely. Keep them private or share with friends and the community.",
    },
    {
      icon: <FiUsers className="w-7 h-7" />,
      title: "Community Driven",
      description:
        "Get recommendations based on what users with similar interests are reading. Explore trending content.",
    },
    {
      icon: <FiSearch className="w-7 h-7" />,
      title: "Smart Search",
      description:
        "Quickly find folders and documents by course, genre, topic, or keywords.",
    },
    {
      icon: <FiBookmark className="w-7 h-7" />,
      title: "Built-in Reader",
      description:
        "Read uploaded documents and other content online with our integrated reader.",
    },
    {
      icon: <FiMonitor className="w-7 h-7" />,
      title: "Cross-Platform",
      description:
        "Use Shelf on any device — desktop, tablet, or phone. Your library everywhere.",
    },
    {
      icon: <FiZap className="w-7 h-7" />,
      title: "Lightning Fast",
      description:
        "Optimized performance ensures your content loads instantly, every time.",
    },
  ];

  type Stat = {
    value: string | number;
    label: string;
    icon: any;
  };

  const stats: Stat[] = [
    {
      value: waitlistCount.toLocaleString(),
      label: "Early Adopters",
      icon: <FiUsers />,
    },
    { value: "5+", label: "Key Features", icon: <FiStar /> },
    { value: "100%", label: "Free to Start", icon: <FiZap /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 overflow-hidden">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
        className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 z-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-700 p-2.5 rounded-xl shadow-lg">
                <Image
                  src="/logo.svg"
                  alt="Shelf Logo"
                  width={20}
                  height={20}
                  className="w-5 h-5 text-white"
                />
              </div>
              <span className="text-2xl font-bold text-black">Shelf</span>
            </div>

            <motion.a
              href="#waitlist"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full font-medium shadow-lg shadow-emerald-500/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Waitlist
            </motion.a>
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
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-5 py-2.5 rounded-full mb-8 border border-emerald-200"
            >
              <div>
                <FiBook className="w-5 h-5 text-emerald-700" />
              </div>
              <span className="text-sm font-semibold text-emerald-800">
                Your Personal E-Library
              </span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.3]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block text-gray-900">Knowledge</span>
              <span className="block text-gray-900">for</span>
              <span className="block bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Everyone
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              A cross-platform e-library combining academic resources and
              leisure reading, designed to bring people together. Organize,
              discover, and share with personalized recommendations and
              community-powered collections.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-6 mb-12"
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
                      {typeof stat.value === "number"
                        ? stat.value.toLocaleString()
                        : stat.value}
                    </div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.a
              href="#features"
              className="inline-flex items-center space-x-2 text-emerald-700 font-semibold group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ x: 5 }}
            >
              <span>Explore features</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FiArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.a>
          </motion.div>

          {/* Interactive 3D Card */}
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
              className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 rounded-[2rem] p-12 shadow-2xl border border-emerald-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem]" />

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
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <BiLibrary className="w-8 h-8 text-white" />
                  </div>
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
                      title: "Academic",
                      count: "234 docs",
                    },
                    { icon: <FiBook />, title: "Novels", count: "89 books" },
                    {
                      icon: <FiBookmark />,
                      title: "Magazines",
                      count: "45 issues",
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
              className="absolute -top-6 -left-6 bg-gradient-to-br from-yellow-400 to-orange-500 w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <FiStar className="w-10 h-10 text-white" />
            </motion.div>

            <motion.div
              className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-400 to-indigo-500 w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center"
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
              Everything You Need
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
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
              >
                <motion.div
                  className="relative h-full bg-white rounded-3xl p-8 border border-gray-200 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative z-10 group">
                    <div
                      className={`inline-flex p-4 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl mb-6 text-white shadow-lg group-hover:animate- transition-colors`}
                    >
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

      <section
        id="waitlist"
        className="py-32 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950"
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

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <FiZap className="w-4 h-4 text-emerald-300" />
              </motion.div>
              <span className="text-emerald-200 font-semibold text-sm">
                LIMITED EARLY ACCESS
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Be First in Line
            </h2>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-2xl mx-auto">
              Join {waitlistCount.toLocaleString()} forward-thinking students
              and readers shaping the future of digital libraries
            </p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {!isSubmitted ? (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-5">
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-8 py-5 rounded-2xl bg-white text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-400/50 shadow-lg"
                    disabled={isLoading}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  />

                  <motion.button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full px-8 py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/50 disabled:opacity-50 relative overflow-hidden group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 flex items-center justify-center space-x-3">
                      <span>
                        {isLoading ? "Joining..." : "Get Early Access"}
                      </span>
                      {!isLoading && (
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <FiArrowRight className="w-6 h-6" />
                        </motion.div>
                      )}
                    </span>
                  </motion.button>

                  <motion.p
                    className="text-center text-emerald-200 text-sm flex items-center justify-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <FiShield className="w-4 h-4" />
                    <span>
                      No spam, ever. Just early access when we launch.
                    </span>
                  </motion.p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className={`rounded-3xl p-10 text-center ${
                  isDuplicate
                    ? "bg-yellow-50 border-2 border-yellow-300"
                    : "bg-white border-2 border-emerald-300"
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                    isDuplicate ? "bg-yellow-100" : "bg-emerald-100"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={
                      isDuplicate ? "text-yellow-500" : "text-emerald-500"
                    }
                  >
                    {isDuplicate ? (
                      <FiAlertCircle className="w-10 h-10" />
                    ) : (
                      <FiCheckCircle className="w-10 h-10" />
                    )}
                  </motion.div>
                </motion.div>
                <div
                  className={`font-bold text-2xl mb-3 ${
                    isDuplicate ? "text-yellow-800" : "text-emerald-800"
                  }`}
                >
                  {isDuplicate ? "Already on the list!" : "Welcome aboard!"}
                </div>
                <div
                  className={`text-lg ${
                    isDuplicate ? "text-yellow-600" : "text-emerald-600"
                  }`}
                >
                  {isDuplicate
                    ? "This email is already on our waitlist. We'll notify you when we launch!"
                    : "Thanks for joining! We'll notify you as soon as Shelf launches."}
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {[
              {
                icon: <FiZap className="w-8 h-8" />,
                title: "Early Access",
                desc: "Be first to try all features",
              },
              {
                icon: <FiGift className="w-8 h-8" />,
                title: "Exclusive Perks",
                desc: "Special bonuses for early users",
              },
              {
                icon: <FiMessageCircle className="w-8 h-8" />,
                title: "Shape the Future",
                desc: "Your feedback matters",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-2xl mb-4 text-emerald-300">
                  {benefit.icon}
                </div>
                <div className="text-white font-bold mb-2">{benefit.title}</div>
                <div className="text-emerald-200 text-sm">{benefit.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-gray-900 py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-emerald-700 p-2.5 rounded-xl">
                  <BiLibrary className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Shelf</span>
              </div>
              <p className="text-emerald-200 leading-relaxed">
                Building the future of digital libraries. Knowledge for students
                and readers, everywhere.
              </p>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-white font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                {["Features", "Community", "Support"].map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                  >
                    <a
                      href="#"
                      className="text-emerald-200 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-white font-bold text-lg mb-4">Connect</h3>
              <div className="flex space-x-4">
                {[
                  {
                    href: "https://x.com/shelfng_",
                    icon: FiTwitter,
                    label: "Twitter",
                  },
                  {
                    href: "https://discord.gg/D54Sj5CrHG",
                    icon: SiDiscord,
                    label: "Discord",
                  },
                  {
                    href: "https://www.instagram.com/shelf.ng_",
                    icon: RiInstagramLine,
                    label: "Instagram",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-800/50 backdrop-blur-sm p-4 rounded-xl border border-emerald-700/50 hover:bg-emerald-700/50 transition-all"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -5, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <social.icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </div>
              <motion.p
                className="text-emerald-200 text-sm mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Join our community and stay updated with the latest news and
                features.
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            className="pt-8 border-t border-emerald-800/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-emerald-300 text-sm">
              © {new Date().getFullYear()} Shelf. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-emerald-300">
              {["Privacy", "Terms"].map((item, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
