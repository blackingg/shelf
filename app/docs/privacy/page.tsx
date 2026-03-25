"use client";

import React from "react";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { PageContainer } from "@/app/components/Layout/PageContainer";

export default function PrivacyPage() {
  return (
    <>
      <AppHeader />
      <PageContainer centered={false}>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-6">
          Privacy Policy
        </h1>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
          Your privacy is important to us. This Privacy Policy explains how
          Shelf collects, uses, and protects your information.
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
          This is placeholder text for the Privacy Policy. We do not share your
          personal information with third parties except as required by law.
          Please update this section with your actual privacy practices.
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300">
          For questions, contact privacy@shelf.app.
        </p>
      </PageContainer>
    </>
  );
}
