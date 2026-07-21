"use client";
import React from "react";
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
  FiUpload,
  FiCompass,
  FiBookOpen,
} from "react-icons/fi";
import { LogoStacked } from "@/app/components/Shared/Logo";

export default function ShelfLanding() {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const stats = [
    { value: "50k+", label: "Resources" },
    { value: "Free", label: "To Join" },
    { value: "100%", label: "Community" },
  ];

  const steps = [
    {
      icon: <FiUpload className="w-5 h-5" />,
      title: "Upload & organize",
      description:
        "Add your books and course materials, then sort them into folders that make sense to you.",
    },
    {
      icon: <FiCompass className="w-5 h-5" />,
      title: "Discover together",
      description:
        "Browse public folders from other students, follow interesting readers, and find your next read.",
    },
    {
      icon: <FiBookOpen className="w-5 h-5" />,
      title: "Read anywhere",
      description:
        "Open the built-in reader on any device and pick up exactly where you left off.",
    },
  ];

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
      color: "bg-kind-folder",
      title: "MTH 201 — 2021/2022",
      count: "17 documents",
    },
    {
      color: "bg-kind-folder",
      title: "Summer Break Novels",
      count: "89 documents",
    },
    {
      color: "bg-kind-folder",
      title: "Magazines & Research",
      count: "45 documents",
    },
  ];

  const books = [
    { title: "Data Structures", from: "from-blue-500", to: "to-blue-700" },
    { title: "Intro to Economics", from: "from-amber-400", to: "to-amber-600" },
    { title: "Poetry Vol. 2", from: "from-purple-500", to: "to-purple-700" },
    { title: "Organic Chemistry", from: "from-emerald-500", to: "to-emerald-700" },
  ];

  return (
    <>
      <section className="relative min-h-[calc(100vh-64px)] flex items-center px-6 py-12 md:py-16 border-b border-line-subtle">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 border border-line bg-inset px-3 py-1.5 rounded-sm mb-6 md:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] uppercase font-medium tracking-widest text-muted">
                Your personal e-library
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[0.95] tracking-tighter text-foreground mb-6">
              Knowledge
              <br />
              for Students <br />
              <span className="text-primary">&amp; Readers</span>
            </h1>

            <p className="text-base md:text-lg text-muted leading-relaxed max-w-md mb-8 md:mb-10">
              A cross-platform library for students and readers. Organise
              academic resources, discover new reading, and share with your
              community.
            </p>

            <div className="flex flex-wrap gap-3 mb-8 md:mb-10">
              <button
                onClick={() =>
                  router.push(isAuthenticated ? "/discover" : "/auth/register")
                }
                className="px-7 py-3.5 bg-primary text-primary-foreground rounded-sm font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
              >
                <span>{isAuthenticated ? "Go to App" : "Start Reading"}</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => router.push("/auth/login")}
                  className="px-7 py-3.5 border border-line bg-surface text-foreground rounded-sm font-medium text-sm hover:bg-wash transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>

            <div className="flex items-center gap-0 divide-x divide-line">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-0.5 ${i === 0 ? "pr-6" : "px-6"}`}
                >
                  <span className="text-xl md:text-2xl font-medium tracking-tight text-foreground leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-faint font-medium">
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
            <div className="relative bg-background rounded-sm p-1 border border-line overflow-hidden">
              <div className="bg-inset p-6 md:p-8 lg:p-10 border border-line-subtle rounded-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <LogoStacked className="w-24 h-7 mb-2 text-primary" />
                    <div className="text-[10px] uppercase tracking-[0.2em] text-faint font-medium">
                      Everywhere, Always
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-6">
                  {books.map((book, i) => (
                    <div
                      key={i}
                      className={`relative aspect-3/4 rounded-sm overflow-hidden border border-line-subtle bg-linear-to-br ${book.from} ${book.to} flex items-end p-1.5`}
                    >
                      <span className="text-[9px] text-white/90 font-medium leading-tight">
                        {book.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  {folders.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-surface px-4 py-3.5 border border-line-subtle rounded-sm group cursor-default hover:bg-wash transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${item.color}`}
                        />
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-faint font-medium mt-0.5">
                            {item.count}
                          </div>
                        </div>
                      </div>
                      <FiArrowRight className="w-3.5 h-3.5 text-faint" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 bg-background border-b border-line-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-sm">
            <div className="inline-flex items-center gap-2 border border-line bg-inset px-3 py-1 rounded-sm mb-5">
              <span className="text-[10px] uppercase font-medium tracking-widest text-muted">
                How it works
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground leading-[0.95] mb-4">
              Three steps to your library
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-sm bg-primary/5 border border-primary/10 text-primary shrink-0">
                    {step.icon}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-faint font-medium">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 bg-background border-b border-line-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 border border-line bg-inset px-3 py-1 rounded-sm mb-5">
              <FiZap className="w-3 h-3 text-primary" />
              <span className="text-[10px] uppercase font-medium tracking-widest text-muted">
                Features
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-foreground leading-[0.95] mb-4">
              Built for how you
              <br />
              actually study
            </h2>
            <p className="text-muted max-w-sm text-base leading-relaxed">
              Everything you need to organise, discover, and read — without the
              clutter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 border border-line-subtle">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 md:p-8 border-r border-b border-line-subtle last:border-r-0 [&:nth-child(3n)]:border-r-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 hover:bg-wash transition-colors group"
              >
                <div className="text-primary mb-5">{feature.icon}</div>
                <h3 className="text-sm font-medium text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 bg-background border-b border-line-subtle">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 border border-line bg-inset px-3 py-1 rounded-sm mb-6">
              <span className="text-[10px] uppercase font-medium tracking-widest text-muted">
                Why Shelf
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-foreground leading-[0.95] mb-5">
              Everything you
              <br />
              need, nothing
              <br />
              you don't
            </h2>
            <p className="text-muted text-base leading-relaxed max-w-xs">
              Shelf strips away the noise so the content takes centre stage.
            </p>
          </div>

          <ul className="divide-y divide-line-subtle border-y border-line-subtle">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-4 py-6">
                <div className="w-5 h-5 rounded-full border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <span className="text-base md:text-lg font-medium text-foreground leading-snug tracking-tight">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 md:py-36 px-6 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-line bg-inset px-3 py-1 rounded-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[10px] uppercase font-medium tracking-widest text-muted">
              Free to join
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter text-foreground leading-[0.95] mb-6">
            Ready to build
            <br />
            your library?
          </h2>

          <p className="text-muted text-base md:text-lg leading-relaxed max-w-sm mx-auto mb-10">
            Join thousands of students and readers already on Shelf.
          </p>

          <button
            onClick={() => router.push("/auth/register")}
            className="px-10 py-4 bg-primary text-primary-foreground rounded-sm font-medium text-base hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer"
          >
            Create Free Account
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </>
  );
}
