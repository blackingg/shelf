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
  <div className="flex justify-between items-center mt-10 space-x-4">
    <button
      onClick={onBack}
      disabled={!canGoBack}
      className={`flex items-center space-x-2 px-6 py-3 rounded-sm font-medium transition-colors ${
        !canGoBack
          ? "text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-0 pointer-events-none"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
      }`}
    >
      <FiArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </button>

    <button
      onClick={onNext}
      disabled={!canProceed || isLoading}
      className={`flex-1 flex items-center space-x-2 px-8 py-3 rounded-sm font-medium transition-all ${
        canProceed && !isLoading
          ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
          : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed"
      }`}
    >
      <div className="flex items-center justify-center w-full space-x-2">
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
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
      </div>
    </button>
  </div>
);
