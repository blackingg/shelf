"use client";

import React from "react";
import Link from "next/link";
import { LogoStacked } from "@/app/components/Shared/Logo";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-black py-20 px-6 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto text-center">
        <Link
          href="/"
          className="inline-flex items-center mb-6"
        >
          <LogoStacked className="w-20 h-6 text-primary" />
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
          Building the future of digital libraries. Knowledge for students and
          readers, everywhere.
        </p>
        <div className="flex justify-center space-x-8 mb-8 text-[10px] font-medium uppercase tracking-widest text-gray-400">
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-primary transition-colors"
          >
            Terms
          </Link>
          <a
            href="https://x.com/shelfng_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            X (Twitter)
          </a>
          <a
            href="https://www.instagram.com/shelf_ng"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Instagram
          </a>
        </div>
        <p className="text-[10px] text-gray-400">
          © {new Date().getFullYear()} Shelf. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
