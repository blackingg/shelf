import { LogoStacked } from "@/app/components/Shared/Logo";
import Link from "next/link";

export const AppHeader: React.FC<{
  logo?: string;
  rightContent?: React.ReactNode;
}> = ({ rightContent }) => (
  <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-100 dark:border-white/10 sticky top-0 z-50 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center h-16">
        <Link
          href={"/"}
          className="flex items-center gap-2"
        >
          <LogoStacked className="w-28 h-8 text-primary" />
        </Link>
        {rightContent}
      </div>
    </div>
  </nav>
);
