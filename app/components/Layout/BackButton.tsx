"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!href) {
      router.back();
    }
  };

  const content = (
    <>
      <FiChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
      <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
        {label}
      </span>
    </>
  );

  const baseClasses = `group flex items-center space-x-2 text-gray-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors py-2 ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={baseClasses}
    >
      {content}
    </button>
  );
};
