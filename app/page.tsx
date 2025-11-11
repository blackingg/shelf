"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiBook,
  FiUsers,
  FiFolder,
  FiArrowRight,
  FiMonitor,
  FiSearch,
  FiBookmark,
  FiCheck,
} from "react-icons/fi";
import { BiLibrary } from "react-icons/bi";
import { Button } from "./components/Form/Button";

export default function ShelfLanding() {
  const router = useRouter();

  // === Feature cards data ===
  const features = [
    {
      icon: <FiFolder className="w-6 h-6 text-emerald-700" />,
      title: "Public & Private Folders",
      description:
        "Organize with private collections or share with public community folders",
      bullets: [
        "Private personal collections",
        "Public class and club folders",
      ],
    },
    {
      icon: <FiUsers className="w-6 h-6 text-emerald-700" />,
      title: "Community Driven",
      description:
        "Share, discover, and rate books with students and readers worldwide",
      bullets: [
        "Rate and review books",
        "Community recommendations",
        "User-contributed content",
      ],
    },
    {
      icon: <FiSearch className="w-6 h-6 text-emerald-700" />,
      title: "Smart Search",
      description:
        "Find books quickly with advanced filters by course, genre, and keywords",
    },
    {
      icon: <FiBookmark className="w-6 h-6 text-emerald-700" />,
      title: "Built-in Reader",
      description: "Read online with bookmarking and highlighting features",
    },
    {
      icon: <FiMonitor className="w-6 h-6 text-emerald-700" />,
      title: "Cross-Platform",
      description: "Seamless experience across desktop and mobile devices",
    },
  ];

  const benefits = [
    "Access thousands of books across all genres",
    "Organize your reading with custom folders",
    "Join a community of passionate readers",
    "Read anywhere, anytime on any device",
    "Get personalized book recommendations",
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-700 p-2 rounded-lg">
                <Image
                  width={20}
                  height={20}
                  src="/logo.svg"
                  alt="Shelf Logo"
                  className="text-white"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">Shelf</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/app/auth/login")}
                className="text-gray-700 hover:text-emerald-700 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/app/auth/register")}
                className="bg-emerald-700 text-white px-6 py-2 rounded-lg hover:bg-emerald-800 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-16">
        <div className="px-6 max-w-4xl mx-auto text-center">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button
              onClick={() => router.push("/app/auth/register")}
              variant="primary"
              icon={<FiArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Start Reading Free
            </Button>
            <Button
              onClick={() => router.push("/app/auth/login")}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="mb-16 px-6 max-w-6xl mx-auto mt-16">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <img
              src="banner.jpg"
              alt="Library"
              className="w-full h-[40vh] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Shelf?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to build your perfect digital library
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-gray-50 p-6 rounded-lg border border-gray-200"
              >
                <div className="bg-emerald-700 rounded-full p-1 mt-1">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
                <p className="text-lg text-gray-700">{benefit}</p>
              </div>
            ))}
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

      <section className="py-20 bg-emerald-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-xl text-emerald-50 mb-10">
            Join thousands of students and readers already using Shelf
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button
              onClick={() => router.push("/app/auth/register")}
              variant="outline"
              icon={<FiArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-gray-100"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-emerald-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-emerald-700 p-2 rounded-lg">
                <BiLibrary className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Shelf</span>
            </div>
            <p className="text-white text-sm">
              © 2025 Shelf. Building the future of digital libraries.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
