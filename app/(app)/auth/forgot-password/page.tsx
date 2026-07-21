"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoStacked } from "@/app/components/Shared/Logo";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { Card } from "@/app/components/Layout/Card";
import { StepHeader } from "@/app/components/Onboarding/StepHeader";
import { FormInput } from "@/app/components/Form/FormInput";
import { NavigationButtons } from "@/app/components/Onboarding/NavigationButtons";
import { useNotifications } from "@/app/context/NotificationContext";
import { useAuthActions } from "@/app/services/auth";
import { FiMail, FiCheckCircle } from "react-icons/fi";

type Step = "email" | "sent";

export default function ForgotPassword() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { forgotPassword, isForgotPending } = useAuthActions();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      addNotification("error", "Please enter a valid email address");
      return;
    }

    try {
      await forgotPassword({ email });
      setCurrentStep("sent");
      addNotification(
        "success",
        `Password reset instructions sent to ${email}`,
      );
    } catch (error: any) {
      addNotification("error", error.message || "Failed to send reset email");
    }
  };

  const handleNext = () => {
    if (currentStep === "email") {
      handleEmailSubmit();
    } else if (currentStep === "sent") {
      router.push("/auth/login");
    }
  };

  const handleBack = () => {
    if (currentStep === "sent") {
      setCurrentStep("email");
    }
  };

  const canProceed = () => {
    if (currentStep === "email") return email.length > 0;
    if (currentStep === "sent") return true;
    return false;
  };

  const canGoBack = currentStep !== "email";
  const isLastStep = currentStep === "sent";

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10 selection:text-primary">
      <AppHeader
        rightContent={
          <Link
            href="/auth/login"
            className="text-primary hover:opacity-80 text-sm font-medium transition-opacity"
          >
            Sign In
          </Link>
        }
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:py-12">
        <div className="w-full max-w-[440px]">
          <Card className="p-4! md:p-8!">
            {currentStep === "email" && (
              <>
                <StepHeader
                  icon={<FiMail className="w-6 h-6 text-primary" />}
                  title="Forgot Password?"
                  description="Enter your email to receive a password reset code"
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
                  icon={<FiMail className="w-5 h-5 text-faint" />}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </>
            )}

            {currentStep === "sent" && (
              <>
                <StepHeader
                  icon={<FiCheckCircle className="w-6 h-6 text-primary" />}
                  title="Check Your Email"
                  description="We've sent password reset instructions to your email"
                />
                <div className="bg-primary/5 border border-primary/10 rounded-sm p-4 mb-6">
                  <p className="text-xs text-primary/80 dark:text-primary text-center leading-relaxed">
                    Didn&apos;t receive the email? Check your spam folder or try
                    again with a different email address.
                  </p>
                </div>
              </>
            )}

            <NavigationButtons
              onBack={handleBack}
              onNext={handleNext}
              canGoBack={canGoBack}
              canProceed={canProceed()}
              isLastStep={isLastStep}
              isLoading={isForgotPending}
              nextLabel={currentStep === "sent" ? "Back to Login" : "Continue"}
            />
          </Card>

          {currentStep === "email" && (
            <p className="mt-8 text-center text-sm text-muted">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-primary font-medium hover:opacity-80 transition-opacity"
              >
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
