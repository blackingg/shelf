import Image from "next/image";
import Link from "next/link";

export const AppHeader: React.FC<{
  logo?: string;
  rightContent?: React.ReactNode;
}> = ({ logo = "/logo.png", rightContent }) => (
  <nav className="bg-white backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex justify-between items-center h-16">
        <Link
          href={"/app"}
          className="flex items-center space-x-3"
        >
          <div className="rounded-lg">
            <Image
              width={20}
              height={20}
              src={logo}
              alt="Shelf Logo"
              className="text-white"
            />
          </div>
          <span className="text-2xl font-bold text-gray-900">Shelf</span>
        </Link>
        {rightContent}
      </div>
    </div>
  </nav>
);
