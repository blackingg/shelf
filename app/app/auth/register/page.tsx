"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { PageContainer } from "@/app/components/Layout/PageContainer";
import { Card } from "@/app/components/Layout/Card";
import { FormInput } from "@/app/components/Form/FormInput";
import { Button } from "@/app/components/Form/Button";
import { Checkbox } from "@/app/components/Form/Checkbox";
import { Divider } from "@/app/components/Form/Divider";
import { SocialLoginButton } from "@/app/components/Form/SocialLoginButton";
import { PasswordStrengthIndicator } from "@/app/components/Form/PasswordStrengthIndicator";
import { useNotifications } from "@/app/context/NotificationContext";
import {
  useRegisterMutation,
  useGoogleAuthMutation,
} from "@/app/store/api/authApi";
import { useAppDispatch } from "@/app/store/store";
import { setCredentials } from "@/app/store/authSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { getErrorMessage } from "@/app/helpers/error";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();
  const dispatch = useAppDispatch();

  /*
  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      const userInfoRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }
      );
      const userInfo = await userInfoRes.json();

      const result = await googleLogin({
        googleId: userInfo.sub,
        email: userInfo.email,
        fullName: userInfo.name,
        avatar: userInfo.picture,
      }).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          rememberMe: true,
        })
      );

      addNotification(
        "success",
        "Account created successfully! Welcome aboard."
      );

      if (result.user.onboardingCompleted) {
        router.push("/app/library");
      } else {
        router.push("/app/onboarding");
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      addNotification("error", getErrorMessage(error, "Google registration failed. Please try again."));
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () =>
      addNotification("error", "Google registration was unsuccessful"),
  });
*/ 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      addNotification("error", "Full name is required");
      return false;
    }

    if (formData.fullName.trim().length < 2) {
      addNotification("error", "Full name must be at least 2 characters");
      return false;
    }

    if (!formData.email.trim()) {
      addNotification("error", "Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      addNotification("error", "Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      addNotification("error", "Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      addNotification("error", "Password must be at least 8 characters");
      return false;
    }

    if (!formData.confirmPassword) {
      addNotification("error", "Please confirm your password");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      addNotification("error", "Passwords do not match");
      return false;
    }

    if (!acceptTerms) {
      addNotification("error", "Please accept the terms and conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        agreeToTerms: acceptTerms,
      }).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          rememberMe: true,
        })
      );

      addNotification(
        "success",
        "Account created successfully! Welcome aboard."
      );

      router.push("/app/onboarding");
    } catch (error: any) {
      console.error("Signup failed:", error);
      addNotification("error", getErrorMessage(error, "An error occurred during signup. Please try again."));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <AppHeader
        rightContent={
          <button
            onClick={() => router.push("/app/auth/login")}
            className="text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
          >
            Already have an account? Sign In
          </button>
        }
      />

      <PageContainer>
        <div className="max-w-lg w-full">
          <Card>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-emerald-700 p-3 rounded-lg mb-4">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">
                Join thousands of students discovering great books
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              <FormInput
                label="Full Name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                icon={<FiUser className="w-5 h-5" />}
                placeholder="Enter your full name"
                autoComplete="name"
              />

              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                icon={<FiMail className="w-5 h-5" />}
                placeholder="Enter your email"
                autoComplete="email"
              />

              <div>
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  icon={<FiLock className="w-5 h-5" />}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  showPasswordToggle={true}
                />
                <PasswordStrengthIndicator password={formData.password} />
              </div>

              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                icon={<FiLock className="w-5 h-5" />}
                placeholder="Confirm your password"
                autoComplete="new-password"
                showPasswordToggle={true}
              />

              <Checkbox
                id="accept-terms"
                checked={acceptTerms}
                onChange={setAcceptTerms}
                label={
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/docs/terms"
                      className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline cursor-pointer"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/docs/privacy"
                      className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline cursor-pointer"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                }
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isRegisterLoading}
                icon={<FiArrowRight className="w-4 h-4" />}
              >
                Create Account
              </Button>
            </form>

            <Divider />

            <div className="grid grid-cols-1 gap-3">
              <SocialLoginButton
                provider="google"
                
              />
            </div>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/app/auth/login"
                className="text-emerald-700 hover:text-emerald-800 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
