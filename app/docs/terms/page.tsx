"use client";

import React from "react";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { PageContainer } from "@/app/components/Layout/PageContainer";

export default function TermsPage() {
  return (
    <>
      <AppHeader />
      <PageContainer centered={false}>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-6">
          Terms of Service
        </h1>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
          Welcome to Shelf. These Terms of Service ("Terms") govern your use of
          our application. By accessing or using Shelf, you agree to be bound by
          these Terms.
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
          This is placeholder text for the Terms of Service. Please replace this
          with your actual terms. Use of Shelf is at your own risk. We reserve
          the right to update these Terms at any time.
        </p>
        <p className="text-base text-gray-700 dark:text-gray-300">
          For more information, contact support@shelf.ng.
        </p>
      </PageContainer>
    </>
  );
}
