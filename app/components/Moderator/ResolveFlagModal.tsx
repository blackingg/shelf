"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/app/components/Form/Button";
import { FormSelect } from "@/app/components/Form/FormSelect";
import { useResolveFlagMutation } from "@/app/services/moderation/hooks";
import { FlagAction } from "@/app/types/admin";

interface ResolveFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  flagId: string;
  contentType: "books" | "folders";
}

interface ActionOption {
  value: FlagAction;
  label: string;
}

const actionOptions: ActionOption[] = [
  { value: "DISMISS", label: "Dismiss Flag" },
  { value: "WARN", label: "Warn User" },
  { value: "REMOVE_CONTENT", label: "Remove Content" },
  { value: "BAN_USER", label: "Ban User" },
];

export const ResolveFlagModal = ({
  isOpen,
  onClose,
  flagId,
  contentType,
}: ResolveFlagModalProps) => {
  const [selectedAction, setSelectedAction] = useState<ActionOption>(actionOptions[0]);
  const [note, setNote] = useState("");
  const resolveFlagMutation = useResolveFlagMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resolveFlagMutation.mutateAsync({
        flagId,
        action: selectedAction.value,
        note: note || undefined,
      });
      onClose();
      setNote("");
      setSelectedAction(actionOptions[0]);
    } catch (err) {
      // Error is handled by mutations/API fetcher toasts
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-screen overflow-hidden bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-neutral-900 rounded-md p-8 border border-gray-200 dark:border-neutral-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 rounded-md flex items-center justify-center text-amber-600 dark:text-amber-500 border border-amber-100 dark:border-amber-900/50">
                  <FiAlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Resolve Flag
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
                Choose the appropriate action to resolve this {contentType === "books" ? "book" : "folder"} flag. This action will be recorded in the system audit logs.
              </p>

              <FormSelect<ActionOption>
                label="Resolution Action"
                options={actionOptions}
                value={selectedAction}
                onChange={(option) => option && setSelectedAction(option)}
                isClearable={false}
                isSearchable={false}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-neutral-300 block">
                  Notes / Explanation (Optional)
                </label>
                <textarea
                  placeholder="Explain your resolution decision..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full min-h-[100px] p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-md text-sm focus:outline-none focus:border-primary/50 transition-colors text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 font-medium text-sm rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors border border-gray-100 dark:border-neutral-700"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  isLoading={resolveFlagMutation.isPending}
                  className="flex-1 py-3 text-sm font-medium rounded-md"
                >
                  Confirm Resolve
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
