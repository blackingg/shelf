"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";

interface BackButtonProps {
  label?: string;
  href?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = "Back",
  href,
  className = "",
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`group flex items-center space-x-2 text-gray-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors py-2 ${className}`}
    >
      <FiChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
      <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
        {label}
      </span>
    </button>
  );
};
