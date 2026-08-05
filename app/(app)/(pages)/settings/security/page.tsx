"use client";
import React from "react";
import { Button } from "@/app/components/Form/Button";
import { FiShield, FiKey } from "react-icons/fi";

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Security
        </h1>
        <p className="text-muted mt-1">
          Protect your account with additional security settings.
        </p>
      </div>

      <div className="bg-background rounded-lg border border-line overflow-hidden">
        <div className="p-6 md:p-8 space-y-16">
          {/* <div>
            <div className="flex items-center space-x-3 mb-6">
              <FiKey className="w-5 h-5 text-faint" />
              <h3 className="text-lg font-semibold text-foreground">
                Two-Factor Authentication
              </h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-300 mb-6">
              Add an extra layer of security to your account by enabling
              two-factor authentication (2FA).
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </div> */}

          <div className="border-t border-line pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <FiShield className="w-5 h-5 text-faint" />
              <h3 className="text-lg font-semibold text-foreground">
                Active Sessions
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-line-subtle rounded-md bg-gray-50 dark:bg-neutral-800/50">
                <div>
                  <div className="font-medium text-foreground">
                    Windows PC - Chrome
                  </div>
                  <div className="text-sm text-muted">
                    San Francisco, CA • Active now
                  </div>
                </div>
                <span className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/50 font-medium">
                  Current
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border border-line-subtle rounded-md dark:bg-neutral-800/30">
                <div>
                  <div className="font-medium text-foreground">
                    iPhone 13 - Safari
                  </div>
                  <div className="text-sm text-muted">
                    San Francisco, CA • 2 hours ago
                  </div>
                </div>
                <button className="text-danger text-sm font-medium hover:underline">
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
