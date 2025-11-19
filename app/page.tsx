"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiBook,
  FiUsers,
  FiFolder,
  FiArrowRight,
  FiMonitor,
  FiSearch,
  FiBookmark,
  FiTwitter,
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

  const features = [
    {
      icon: <FiFolder className="w-6 h-6 text-emerald-700" />,
      title: "Public & Private Folders",
      description:
        "Store your documents and reading materials safely. Keep them private or share with friends and the community.",
      bullets: [
        "Your personal documents stay private",
        "Share folders with friends or groups",
        "All shared documents are reviewed by the community",
      ],
    },
    {
      icon: <FiUsers className="w-6 h-6 text-emerald-700" />,
      title: "Community Driven",
      description:
        "Discover what others are reading and sharing, both for school and leisure.",
      bullets: [
        "Get recommendations based on what users with similar interests are reading",
        "Explore trending academic and leisure content",
        "Contribute your own documents and collections",
      ],
    },
    {
      icon: <FiSearch className="w-6 h-6 text-emerald-700" />,
      title: "Smart Search",
      description:
        "Quickly find folders and documents by course, genre, topic, or keywords.",
    },
    {
      icon: <FiBookmark className="w-6 h-6 text-emerald-700" />,
      title: "Built-in Reader",
      description: "Read uploaded documents and other content online.",
    },
    {
      icon: <FiMonitor className="w-6 h-6 text-emerald-700" />,
      title: "Cross-Platform",
      description: "Use Shelf on any device — desktop, tablet, or phone.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-700 p-2 rounded-lg">
                <Image
                  src="/logo.svg"
                  alt="Shelf Logo"
                  width={16}
                  height={16}
                  className="w-5 h-5 text-white"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">Shelf</span>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full mb-8">
            <FiBook className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-medium text-emerald-700">
              Your Personal E-Library
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-gray-900">
            Knowledge for
            <br />
            Students & Readers
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            A cross-platform e-library that blends academic resources with
            leisure reading — novels, magazines and comics. Organize, discover,
            and share knowledge with personalized recommendations and
            community-driven collections.
          </p>

          <div className="max-w-md mx-auto mb-16">
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-6 py-4 rounded-lg border border-gray-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none text-gray-700 bg-white"
                  required
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-700 text-white px-8 py-4 rounded-lg font-medium hover:bg-emerald-800 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{isLoading ? "Joining..." : "Get Early Access"}</span>
                  {!isLoading && <FiArrowRight className="w-5 h-5" />}
                </button>
              </form>
            ) : (
              <div
                className={`rounded-lg p-6 ${
                  isDuplicate
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-green-50 border border-green-200"
                }`}
              >
                <div
                  className={`font-medium mb-2 ${
                    isDuplicate ? "text-yellow-800" : "text-green-800"
                  }`}
                >
                  {isDuplicate
                    ? "This email is already on our waitlist."
                    : "Thanks for joining!"}
                </div>
                <div
                  className={`text-sm ${
                    isDuplicate ? "text-yellow-600" : "text-green-600"
                  }`}
                >
                  {"  We’ll notify you when Shelf launches."}
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-3">
              Join {waitlistCount.toLocaleString()} students and readers on the
              waitlist
            </p>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-16 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-gray-600">
              From textbooks to novels, magazines and comics, organized the way
              you learn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 border border-gray-200 flex flex-col"
              >
                <div className="bg-emerald-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                {feature.bullets && (
                  <ul className="space-y-2 text-sm text-gray-600">
                    {feature.bullets.map((b, i) => (
                      <li key={i}>• {b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-emerald-800">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform
            <br />
            How You Learn?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Be among the first to experience the future of digital libraries
          </p>

          {!isSubmitted ? (
            <div className="max-w-md mx-auto">
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="
          w-full px-6 py-4 rounded-lg
          bg-white text-gray-900 
          placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-emerald-400
        "
                  required
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
          w-full px-8 py-4 rounded-lg font-medium 
          bg-emerald-500 hover:bg-emerald-600 
          text-white hover:text-white 
          transition-colors duration-200 
          flex items-center justify-center space-x-2
          disabled:opacity-50
        "
                >
                  <span>{isLoading ? "Joining..." : "Join Waitlist"}</span>
                  {!isLoading && <FiArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </div>
          ) : (
            <div
              className={`max-w-md mx-auto rounded-lg p-6 ${
                isDuplicate
                  ? "bg-yellow-50 border border-yellow-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <div
                className={`font-medium mb-2 ${
                  isDuplicate ? "text-yellow-800" : "text-green-800"
                }`}
              >
                {isDuplicate
                  ? "This email is already on our waitlist."
                  : "Thanks for joining!"}
              </div>
              <div
                className={`text-sm ${
                  isDuplicate ? "text-yellow-600" : "text-green-600"
                }`}
              >
                We’ll notify you when Shelf launches.
              </div>
            </div>
          )}

          <p className="text-white mt-6 text-sm">
            {"  No spam, ever. We'll just let you know when we launch."}
          </p>
        </div>

        <div className="mt-24">
          <div className="max-w-6xl mx-auto my-6 px-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-emerald-700 p-2 rounded-lg">
                <BiLibrary className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Shelf</span>
            </div>

            <div className="flex items-center justify-center space-x-6 mb-6">
              <a
                href="https://x.com/shelfng_"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700 p-3 rounded-lg transition-all duration-200"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://discord.gg/D54Sj5CrHG"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700 p-3 rounded-lg transition-all duration-200"
                aria-label="Discord"
              >
                <SiDiscord className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/shelf.ng_"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700 p-3 rounded-lg transition-all duration-200"
                aria-label="Instagram"
              >
                <RiInstagramLine className="w-5 h-5 text-white" />
              </a>
            </div>

            <p className="text-white text-sm">
              © {new Date().getFullYear()} Shelf. Building the future of digital
              libraries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
