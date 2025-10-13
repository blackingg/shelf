"use client";

import React, { useEffect, useState } from "react";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { PageContainer } from "@/app/components/Layout/PageContainer";

export default function TermsPage() {
  return (
    <>
      <AppHeader />
      <PageContainer centered={false}>
        <h1 className="text-black">Privacy Page</h1>
      </PageContainer>
    </>
  );
}
