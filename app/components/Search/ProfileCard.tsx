"use client";

import Image from "next/image";
import { UserMinimal } from "@/app/types/user";

interface ProfileCardProps {
  user: UserMinimal;
  onClick: () => void;
}

export function ProfileCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex flex-col items-center p-4 rounded-md border border-gray-100 dark:border-neutral-800"
        >
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-neutral-700 mb-3" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded-sm" />
          <div className="h-3 w-20 bg-gray-100 dark:bg-neutral-800 rounded-sm mt-2" />
        </div>
      ))}
    </>
  );
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-4 rounded-md border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors text-center"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold mb-3">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.fullName || user.username}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          (user.fullName || user.username).charAt(0).toUpperCase()
        )}
      </div>

      <span className="text-sm font-medium text-gray-900 dark:text-white truncate w-full">
        {user.fullName}
      </span>
      <span className="text-xs text-gray-500 dark:text-neutral-400 truncate w-full mt-0.5">
        @{user.username}
      </span>
    </button>
  );
};
