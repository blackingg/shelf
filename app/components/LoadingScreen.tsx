import Image from "next/image";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-neutral-900 flex flex-col items-center justify-center z-50">
      <div className="relative flex flex-col items-center">
        <div className="animate-pulse">
          <Image
            src="/logo-stacked-2.png"
            alt="Shelf Logo"
            width={1200}
            height={150}
            priority
          />
        </div>
      </div>
    </div>
  );
};
