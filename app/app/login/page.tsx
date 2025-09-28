"use client";
import React, { useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (): Promise<void> => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Login successful:", { ...formData, rememberMe });
      // Redirect to dashboard
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignup = (): void => {
    console.log("Switch to signup page");
    // Navigate to signup page
  };

  const handleForgotPassword = (): void => {
    console.log("Forgot password clicked");
    // Navigate to forgot password page or show modal
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-700 p-2 rounded-lg">
                <div className="w-5 h-5 bg-white rounded"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900">Shelf</span>
            </div>
            <button
              onClick={switchToSignup}
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h1>
              <p className="text-gray-600">
                Sign in to continue your reading journey
              </p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Email */}
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </div>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-1 outline-none transition-colors ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-gray-700">
                    Password
                  </div>
                  <button
                    onClick={handleForgotPassword}
                    className="text-sm text-emerald-700 hover:text-emerald-800"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-1 outline-none transition-colors ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-emerald-700 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                }`}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="text-lg mr-2">📧</span>
                  Google
                </button>
                <button className="w-full inline-flex justify-center py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="text-lg mr-2">📘</span>
                  Facebook
                </button>
              </div>
            </div>

            {/* Demo Account */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium mb-2">
                Demo Account
              </p>
              <p className="text-xs text-blue-600 mb-2">
                Try Shelf without creating an account:
              </p>
              <button
                onClick={() => {
                  setFormData({ email: "demo@shelf.com", password: "demo123" });
                }}
                className="text-xs text-blue-700 hover:text-blue-800 underline"
              >
                Fill demo credentials
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to Shelf?{" "}
              <button
                onClick={switchToSignup}
                className="text-emerald-700 hover:text-emerald-800 font-medium"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
