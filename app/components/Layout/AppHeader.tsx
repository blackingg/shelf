import { LogoStacked } from "@/app/components/Logo";
import Link from "next/link";

export const AppHeader: React.FC<{
  logo?: string;
  rightContent?: React.ReactNode;
}> = ({ rightContent }) => (
  <nav className="bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-white/10 sticky hidden lg:block top-0 z-40">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center h-14">
        <Link
          href={"/"}
          className="flex items-center gap-2"
        >
          <LogoStacked className="w-24 h-9 text-[#072c0b] dark:text-[#D0FDC2]" />
        </Link>
        {rightContent}
      </div>
    </div>
  </nav>
);
