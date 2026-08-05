"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/app/components/Layout/Card";
import { useNotifications } from "@/app/context/NotificationContext";
import { useInviteById } from "@/app/services/folders";
import { FiFolder, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";
import { SpinnerLoader } from "@/app/components/Loader/SpinnerLoader";
import { useUser } from "@/app/services";

export default function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const { addNotification } = useNotifications();
  const { invite, isLoading, isError, actions, isResponding } = useInviteById(id);

  const handleResponse = async (accept: boolean) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/invites/${id}`);
      return;
    }

    try {
      await actions.respondToInvite(accept);
      addNotification(
        "success",
        accept ? "Invitation accepted" : "Invitation declined",
        accept ? `You are now a collaborator on "${invite?.folder?.name}".` : "The invitation has been removed."
      );
      if (accept && invite?.folder?.slug) {
        router.push(`/folders/${invite.folder.slug}`);
      } else {
        router.push("/discover");
      }
    } catch (error: any) {
      addNotification("error", "Failed to respond to invitation. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <SpinnerLoader />
        <p className="mt-4 text-gray-500 font-medium tracking-tight">Fetching invitation details...</p>
      </div>
    );
  }

  if (isError || !invite) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <Card className="max-w-md w-full p-8 text-center border-none shadow-none">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Invitation Not Found</h2>
          <p className="text-muted mb-8 leading-relaxed">
            This invitation may have expired, been cancelled, or you don't have permission to view it.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-sm w-full transition-opacity hover:opacity-90"
          >
            Go to Discover
          </Link>
        </Card>
      </div>
    );
  }

  const inviterName = typeof invite.invitedBy === 'object' 
    ? (invite.invitedBy as any)?.fullName || (invite.invitedBy as any)?.username 
    : 'Someone';

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 px-6">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-medium text-foreground tracking-tight mb-2">
            Collaboration Invite
          </h1>
          <p className="text-muted">
            Join a shared collection on Shelf
          </p>
        </div>

        <Card className="p-8 md:p-10 border-line-subtle">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
              <FiFolder className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
              {invite.folder?.name || "Shared Folder"}
            </h2>
            
            <p className="text-muted mb-8 leading-relaxed text-sm md:text-base">
              <span className="font-bold text-primary">@{inviterName}</span> has invited you to collaborate 
              on this folder as an <span className="font-bold text-foreground uppercase text-[10px] tracking-widest bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-sm inline-block ml-1">{invite.role}</span>.
            </p>

            {invite.message && (
              <div className="w-full bg-gray-50 dark:bg-neutral-800/50 p-5 rounded-sm border border-line-subtle mb-8 italic text-sm text-gray-500 text-left">
                "{invite.message}"
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <button
                onClick={() => handleResponse(true)}
                disabled={isResponding}
                className="flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isResponding ? <SpinnerLoader className="w-5 h-5 text-white" /> : <FiCheck className="w-5 h-5" />}
                Accept Invite
              </button>
              <button
                onClick={() => handleResponse(false)}
                disabled={isResponding}
                className="flex items-center justify-center gap-2 py-4 bg-gray-100 dark:bg-neutral-800 text-muted font-bold rounded-sm hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all disabled:opacity-50"
              >
                <FiX className="w-5 h-5" />
                Decline
              </button>
            </div>

            {!isAuthenticated && (
              <p className="mt-8 text-xs text-gray-400 max-w-[280px]">
                You will be asked to sign in before accepting the invitation.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
