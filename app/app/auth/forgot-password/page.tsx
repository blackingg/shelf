"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { PageContainer } from "@/app/components/Layout/PageContainer";
import { Card } from "@/app/components/Layout/Card";
import { StepHeader } from "@/app/components/Onboarding/StepHeader";
import { FormInput } from "@/app/components/Form/FormInput";
import { NavigationButtons } from "@/app/components/Onboarding/NavigationButtons";
import { PasswordStrengthIndicator } from "@/app/components/Form/PasswordStrengthIndicator";
import { useNotifications } from "@/app/context/NotificationContext";
import { FiMail, FiLock, FiKey, FiCheckCircle } from "react-icons/fi";

type Step = "email" | "sent" | "otp" | "newPassword";

export default function ForgotPassword() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswords = () => {
    const newErrors: Record<string, string> = {};

    if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleEmailSubmit = async () => {
    setErrors({});

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      addNotification("error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep("sent");
      addNotification("success", `Verification code sent to ${email}`);
    }, 1500);
  };

  const handleOtpSubmit = async () => {
    setErrors({});

    if (otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit code" });
      addNotification("error", "Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep("newPassword");
      addNotification("success", "Code verified successfully");
    }, 1500);
  };

  const handlePasswordSubmit = async () => {
    const validationErrors = validatePasswords();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      addNotification("error", "Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      addNotification("success", "Password reset successfully! Please log in.");
      // Redirect to login
      router.push("/app/auth/login");
    }, 1500);
  };

  const handleNext = () => {
    if (currentStep === "email") {
      handleEmailSubmit();
    } else if (currentStep === "sent") {
      setCurrentStep("otp");
    } else if (currentStep === "otp") {
      handleOtpSubmit();
    } else if (currentStep === "newPassword") {
      handlePasswordSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === "sent") {
      setCurrentStep("email");
    } else if (currentStep === "otp") {
      setCurrentStep("sent");
    } else if (currentStep === "newPassword") {
      setCurrentStep("otp");
    }
  };

  const canProceed = () => {
    if (currentStep === "email") return email.length > 0;
    if (currentStep === "sent") return true;
    if (currentStep === "otp") return otp.length === 6;
    if (currentStep === "newPassword")
      return newPassword.length >= 8 && confirmPassword.length >= 8;
    return false;
  };

  const canGoBack = currentStep !== "email";
  const isLastStep = currentStep === "newPassword";

  return (
    <>
      <AppHeader />
      <PageContainer>
        <Card className="w-full max-w-md">
          {currentStep === "email" && (
            <>
              <StepHeader
                icon={<FiMail className="w-6 h-6 text-emerald-700" />}
                title="Forgot Password?"
                description="Enter your email address and we'll send you a code to reset your password"
              />
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && canProceed() && handleNext()
                }
                error={errors.email}
                icon={<FiMail className="w-5 h-5" />}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </>
          )}

          {currentStep === "sent" && (
            <>
              <StepHeader
                icon={<FiCheckCircle className="w-6 h-6 text-emerald-700" />}
                title="Check Your Email"
                description={`We've sent a 6-digit verification code to ${email}`}
              />
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-emerald-800 text-center">
                  Didn't receive the code? Check your spam folder or click
                  continue to enter the code
                </p>
              </div>
            </>
          )}

          {currentStep === "otp" && (
            <>
              <StepHeader
                icon={<FiKey className="w-6 h-6 text-emerald-700" />}
                title="Enter Verification Code"
                description="Enter the 6-digit code we sent to your email"
              />
              <FormInput
                label="Verification Code"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                onKeyPress={(e) =>
                  e.key === "Enter" && canProceed() && handleNext()
                }
                error={errors.otp}
                icon={<FiKey className="w-5 h-5" />}
                placeholder="123456"
                autoComplete="one-time-code"
              />
              <button
                onClick={() => setCurrentStep("sent")}
                className="text-sm text-emerald-700 hover:text-emerald-800 font-medium mt-3"
              >
                Resend code
              </button>
            </>
          )}

          {currentStep === "newPassword" && (
            <>
              <StepHeader
                icon={<FiLock className="w-6 h-6 text-emerald-700" />}
                title="Create New Password"
                description="Choose a strong password for your account"
              />
              <div className="space-y-4">
                <div>
                  <FormInput
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={errors.newPassword}
                    icon={<FiLock className="w-5 h-5" />}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    showPasswordToggle
                  />
                  <PasswordStrengthIndicator password={newPassword} />
                </div>
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && canProceed() && handleNext()
                  }
                  error={errors.confirmPassword}
                  icon={<FiLock className="w-5 h-5" />}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  showPasswordToggle
                />
              </div>
            </>
          )}

          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            canGoBack={canGoBack}
            canProceed={canProceed()}
            isLastStep={isLastStep}
            isLoading={isLoading}
          />

          {currentStep === "email" && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  onClick={() => router.push("/app/auth/login")}
                  className="text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </Card>
      </PageContainer>
    </>
  );
}
