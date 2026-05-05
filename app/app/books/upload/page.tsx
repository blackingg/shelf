"use client";
import React, { useState, useEffect } from "react";
import { FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/app/components/Form/Button";
import { useUpload } from "@/app/hooks/useUpload";
import MultipleUploadForm, {
  MultipleFileProvider,
} from "@/app/components/MultipleUploadForm";
import SingleUploadForm from "@/app/components/SingleUploadForm";
import { motion } from "framer-motion";

export default function UploadPage() {
  const [mounted, setMounted] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [multiplesList, setMultiplesList] = useState<FileList | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    isAuthorized,
    isLoading: isAuthLoading,
    authorize,
    password,
    setPassword,
    error: authError,
  } = useUpload();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authorize();
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[11px] uppercase font-semibold tracking-wider text-gray-400 dark:text-neutral-500 mb-2 block">
      {children}
    </label>
  );

  if (isAuthLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-neutral-900 border-l border-gray-100 dark:border-neutral-800">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Verifying Access
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 border-l border-gray-100 dark:border-neutral-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 bg-emerald-500"></div>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-white tracking-tight">
              Administrative Access
            </h1>
          </div>
          <p className="text-gray-500 dark:text-neutral-500 text-sm mb-10 leading-relaxed">
            Please enter the authorization password to continue to the document
            upload pipeline.
          </p>
          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label>Access Password</Label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-4 pr-12 py-3 bg-transparent border ${
                    authError
                      ? "border-red-500"
                      : "border-gray-200 dark:border-neutral-800"
                  } text-sm outline-none focus:border-emerald-500 transition-all`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              icon={<FiArrowRight className="text-sm" />}
            >
              Continue
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <MultipleFileProvider>
      {!multiplesList && !isBulkMode ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 border-l border-gray-100 dark:border-neutral-800 overflow-y-auto">
          <main className="p-6 md:p-12 max-w-4xl mx-auto w-full">
            <SingleUploadForm
              onSwitchToBulk={(files) => {
                if (files) setMultiplesList(files);
                setIsBulkMode(true);
              }}
            />
          </main>
        </div>
      ) : (
        <BulkUploadView
          onExit={() => {
            setIsBulkMode(false);
            setMultiplesList(null);
          }}
          multiplesList={multiplesList}
        />
      )}
    </MultipleFileProvider>
  );
}

function BulkUploadView({
  onExit,
  multiplesList,
}: {
  onExit: () => void;
  multiplesList: FileList | null;
}) {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 border-l border-gray-100 dark:border-neutral-800 overflow-y-auto">
      <div className="p-6 md:p-12 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-neutral-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-emerald-500"></div>
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
              Bulk Upload
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onExit}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors border border-emerald-500/20 px-3 py-1.5 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
            >
              Single Upload Mode
            </button>
          </div>
        </div>
        <MultipleUploadForm files={multiplesList} />
      </div>
    </div>
  );
}
