import Image from "next/image";
import Link from "next/link";

export const AppHeader: React.FC<{
  logo?: string;
  rightContent?: React.ReactNode;
}> = ({ rightContent }) => (
  <nav className="bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-white/10 sticky top-0 z-40">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center h-14">
        <Link
          href={"/"}
          className="flex items-center gap-2"
        >
          <Image
            src="/logo-stacked-1.png"
            alt="Shelf"
            width={112}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>
        {rightContent}
      </div>
    </div>
  </nav>
);
