import Image from "next/image";
import Link from "next/link";

export const AppHeader: React.FC<{
  logo?: string;
  rightContent?: React.ReactNode;
}> = ({ rightContent }) => (
  <nav className="bg-white backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex justify-between items-center h-16">
        <Link
          href={"/"}
          className="flex items-center space-x-3"
        >
          <Image
            src="/logo-stacked-1.png"
            alt="Shelf"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        {rightContent}
      </div>
    </div>
  </nav>
);
