import Image from "next/image";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-neutral-900 flex flex-col items-center justify-center z-50">
      <div className="relative flex flex-col items-center">
        <div className="bg-primary p-4 rounded-2xl shadow-xl animate-pulse">
          <Image
            src="/logo.svg"
            alt="Shelf Logo"
            width={48}
            height={48}
            className="w-12 h-12"
            priority
          />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white tracking-tight animate-fade-in">
          Shelf
        </h1>
      </div>
    </div>
  );
};
