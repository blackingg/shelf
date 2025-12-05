"use client";
import React from "react";
import { NotificationProvider } from "@/app/context/NotificationContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
