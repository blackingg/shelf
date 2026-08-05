"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { Card } from "@/app/components/Layout/Card";
import { StepHeader } from "@/app/components/Onboarding/StepHeader";
import { useNotifications } from "@/app/context/NotificationContext";
import { useAuthActions } from "@/app/services/auth";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { SpinnerLoader } from "@/app/components/Loader/SpinnerLoader";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { addNotification } = useNotifications();
  const { verifyEmail, isVerifyPending } = useAuthActions();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string>(
    "Verifying your email address...",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(
        "Invalid or missing verification token. Please check your email link.",
      );
      return;
    }

    const performVerification = async () => {
      try {
        await verifyEmail({ token });
        setStatus("success");
        setMessage(
          "Your email has been verified successfully. You can now access all features.",
        );
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.message ||
            "Email verification failed. The link may have expired.",
        );
      }
    };

    // Use a small delay for better UX feel
    const timer = setTimeout(() => {
      performVerification();
    }, 1500);

    return () => clearTimeout(timer);
  }, [token, verifyEmail]);

  if (status === "loading") {
    return (
      <Card className="p-4! md:p-8! text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <SpinnerLoader />
          <p className="mt-4 text-muted font-medium">
            {message}
          </p>
        </div>
      </Card>
    );
  }

  if (status === "success") {
    return (
      <Card className="p-4! md:p-8! text-center">
        <StepHeader
          icon={<FiCheckCircle className="w-10 h-10 text-emerald-500" />}
          title="Email Verified"
          description={message}
        />
        <div className="mt-8">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity w-full"
          >
            Continue to Sign In
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4! md:p-8! text-center">
      <StepHeader
        icon={<FiAlertCircle className="w-10 h-10 text-danger" />}
        title="Verification Failed"
        description={message}
      />
      <div className="mt-8 space-y-4">
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:opacity-90 transition-opacity w-full"
        >
          Back to Sign In
        </Link>
        <p className="text-sm text-muted">
          Didn't receive an email?{" "}
          <Link
            href="/auth/register"
            className="text-primary font-medium"
          >
            Try registering again
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function VerifyEmailPage() {
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
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-medium text-foreground mb-2 tracking-tight">
              Email Verification
            </h1>
            <p className="text-muted">
              Securing your account access
            </p>
          </div>
          <Suspense
            fallback={
              <Card className="p-8 text-center">
                <SpinnerLoader />
                <p className="mt-4 text-muted">Loading...</p>
              </Card>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
