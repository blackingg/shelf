import React from "react";

export const SpinnerLoader: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`flex items-center justify-center ${className}`}
    data-testid="spinner-loader"
  >
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
  </div>
);
