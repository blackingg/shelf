import { LogoStacked2 } from "@/app/components/Shared/Logo";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-neutral-900 flex flex-col items-center justify-center z-50">
      <div className="relative flex flex-col items-center">
        <div className="animate-pulse">
          <LogoStacked2 className="w-24 h-24 text-[#072c0b] dark:text-[#D0FDC2]" />
        </div>
      </div>
    </div>
  );
};
