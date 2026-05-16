"use client";

import { LogoStacked } from "@/app/components/Shared/Logo";
import Link from "next/link";
import { useEffect, useState } from "react";

export const AppHeader: React.FC<{
  logo?: string;
  rightContent?: React.ReactNode;
}> = ({ rightContent }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 transition-all duration-200 ${
        isScrolled
          ? "border-b border-gray-100 dark:border-white/10 shadow-sm"
          : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          <Link href={"/"} className="flex items-center gap-2">
            <LogoStacked className="w-24 h-7 md:w-28 md:h-8 text-primary" />
          </Link>
          {rightContent}
        </div>
      </div>
    </nav>
  );
};

