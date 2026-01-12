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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FiAlertTriangle className="w-10 h-10 text-red-500" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Don&apos;t worry, your data is
              safe. Try refreshing the page or go back home.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-xl text-left overflow-auto max-h-40">
                <p className="text-sm font-mono text-red-600 break-words">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleReload}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
              >
                <FiRefreshCw className="w-5 h-5" />
                Reload Page
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 border border-gray-200"
              >
                <FiHome className="w-5 h-5" />
                Go Home
              </motion.button>
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
          `A rendering error occurred: ${error.message}`
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
          `An unexpected error occurred: ${error.message}`
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
