import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

export const NavigationButtons: React.FC<{
  onBack?: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canProceed: boolean;
  isLastStep: boolean;
  isLoading?: boolean;
}> = ({
  onBack,
  onNext,
  canGoBack,
  canProceed,
  isLastStep,
  isLoading = false,
}) => (
  <div className="flex justify-between items-center mt-10">
    <button
      onClick={onBack}
      disabled={!canGoBack}
      className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
        !canGoBack
          ? "text-gray-400 dark:text-neutral-600 cursor-not-allowed"
          : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
      }`}
    >
      <FiArrowLeft />
      <span>Back</span>
    </button>

    <button
      onClick={onNext}
      disabled={!canProceed || isLoading}
      className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all ${
        canProceed && !isLoading
          ? "bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 shadow-lg cursor-pointer"
          : "bg-gray-200 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600 cursor-not-allowed"
      }`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Setting up...</span>
        </>
      ) : (
        <>
          <span>{isLastStep ? "Get Started" : "Continue"}</span>
          {isLastStep ? (
            <FiCheck className="w-4 h-4" />
          ) : (
            <FiArrowRight className="w-4 h-4" />
          )}
        </>
      )}
    </button>
  </div>
);
