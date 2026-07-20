"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { FiX } from "react-icons/fi";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** Custom header content, replacing the default title + close row. */
  header?: React.ReactNode;
  /** Pinned below the scrollable content, e.g. a "See all" link. */
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** Extra classes on the sheet container, e.g. a max-height override. */
  className?: string;
}

/**
 * Mobile bottom-sheet chrome: backdrop, slide-up container, drag handle,
 * drag-to-dismiss, safe-area padding. Desktop anchored dropdowns are a
 * separate, per-consumer concern — this component renders nothing above `lg`.
 */
export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  header,
  footer,
  children,
  className = "",
}) => {
  if (typeof document === "undefined") return null;

  const handleDragEnd = (
    _: PointerEvent | MouseEvent | TouchEvent,
    info: PanInfo,
  ) => {
    if (info.offset.y > 80 || info.velocity.y > 500) onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className={`fixed inset-x-0 bottom-0 z-50 bg-surface border-t border-line rounded-t-3xl flex flex-col max-h-[85dvh] safe-area-bottom ${className}`}
          >
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1 rounded-full bg-line" />
            </div>

            {(title || header) && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-line-subtle shrink-0">
                {header ?? (
                  <>
                    <h3 className="font-bold text-foreground text-sm">
                      {title}
                    </h3>
                    <button
                      onClick={onClose}
                      className="p-1.5 -mr-1.5 text-faint hover:text-foreground active:bg-pressed rounded-md transition-colors"
                      aria-label="Close"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {children}
            </div>

            {footer && (
              <div className="shrink-0 border-t border-line-subtle">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
