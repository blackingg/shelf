"use client";
import React, { Component, ReactNode } from "react";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";
import { motion } from "motion/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log to error reporting service (e.g., Sentry)
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call the optional onError callback
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-xl w-full text-center"
          >
            <div className="flex justify-center mb-10">
              <div className="w-20 h-20 bg-gray-50 dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-neutral-800 flex items-center justify-center">
                <FiAlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <span className="inline-block text-[11px] font-black uppercase tracking-[0.4em] text-red-600 dark:text-red-500 mb-6 px-4 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-800/30">
              System Error
            </span>

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter leading-none">
              Something went <span className="text-red-600">wrong</span>.
            </h1>

            <p className="text-gray-500 dark:text-neutral-500 mb-12 text-lg font-medium max-w-md mx-auto leading-relaxed">
              We encountered an unexpected error. Don&apos;t worry, your data is
              safe. Try refreshing the page or go back home.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-10 p-5 bg-red-50/50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-md text-left overflow-auto max-h-48 custom-scrollbar">
                <p className="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400 mb-2">
                  Developer Stack Trace
                </p>
                <p className="text-sm font-mono text-gray-900 dark:text-white break-words mb-3">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-[10px] text-gray-500 dark:text-neutral-500 whitespace-pre-wrap leading-normal">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 h-14 bg-gray-900 dark:bg-white text-white dark:text-neutral-950 text-[11px] font-black uppercase tracking-widest rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/5 dark:shadow-white/5"
              >
                <FiRefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 h-14 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 text-[11px] font-black uppercase tracking-widest rounded-md hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <FiHome className="w-4 h-4" />
                Go Back Home
              </button>
            </div>

            <div className="mt-16 pt-8 border-t border-dashed border-gray-100 dark:border-neutral-800/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-600">
                If this persists, please reach out to our support team.
              </p>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { useNotifications } from "@/app/context/NotificationContext";

// Hook-based wrapper for using notifications with ErrorBoundary
export function ErrorBoundaryWithNotification({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { addNotification } = useNotifications();

  return (
    <ErrorBoundary
      fallback={fallback}
      onError={(error) => {
        addNotification(
          "error",
          `A rendering error occurred: ${error.message}`,
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// A wrapper component that shows error notifications using the notification system
export function NotificationErrorHandler({
  children,
}: {
  children: ReactNode;
}) {
  const { addNotification } = useNotifications();

  return (
    <ErrorBoundary
      onError={(error) => {
        addNotification(
          "error",
          `An unexpected error occurred: ${error.message}`,
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
