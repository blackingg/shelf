import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

export const NavigationButtons: React.FC<{
  onBack?: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canProceed: boolean;
  isLastStep: boolean;
  isLoading?: boolean;
  nextLabel?: string;
  backLabel?: string;
}> = ({
  onBack,
  onNext,
  canGoBack,
  canProceed,
  isLastStep,
  isLoading = false,
  nextLabel,
  backLabel,
}) => (
  <div className="flex justify-between items-center mt-10 space-x-4">
    <button
      onClick={onBack}
      disabled={!canGoBack}
      className={`flex items-center space-x-2 px-6 py-3 rounded-sm font-medium transition-colors ${
        !canGoBack
          ? "text-faint cursor-not-allowed opacity-0 pointer-events-none"
          : "text-muted hover:text-foreground cursor-pointer"
      }`}
    >
      <FiArrowLeft className="w-4 h-4" />
      <span>{backLabel || "Back"}</span>
    </button>

    <button
      onClick={onNext}
      disabled={!canProceed || isLoading}
      className={`flex-1 flex items-center space-x-2 px-8 py-3 rounded-sm font-medium transition-all ${
        canProceed && !isLoading
          ? "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
          : "bg-inset text-faint cursor-not-allowed"
      }`}
    >
      <div className="flex items-center justify-center w-full space-x-2">
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{nextLabel || (isLastStep ? "Get Started" : "Continue")}</span>
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
