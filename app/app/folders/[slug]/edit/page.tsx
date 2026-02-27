"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiSave,
  FiLock,
  FiGlobe,
  FiFolder,
  FiUsers,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { useNotifications } from "@/app/context/NotificationContext";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";
import {
  FolderVisibility,
  FolderRoles,
  Collaborator,
} from "@/app/types/folder";
import { UserMinimal } from "@/app/types/user";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import UserSearchInput from "@/app/components/UserSearchInput";
import {
  useGetFolderBySlugQuery,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
  useGetCollaboratorsQuery,
  useInviteCollaboratorMutation,
  useRemoveCollaboratorMutation,
  useUpdateCollaborationSettingsMutation,
} from "@/app/store/api/foldersApi";
import { getErrorMessage } from "@/app/helpers/error";
import { Switch } from "@/app/components/Form/Switch";
import FolderEditSkeleton from "@/app/components/Skeletons/FolderEditSkeleton";

export default function EditFolderPage() {
  const params = useParams();
  const router = useRouter();
  const slug =
    typeof params.slug === "string" ? params.slug : params.slug?.[0] || "";
  const { addNotification } = useNotifications();
  const user = useSelector(selectCurrentUser);
  const currentUser = user?.username || "";

  // API Hooks
  const {
    data: folder,
    isLoading: isFolderLoading,
    isError,
  } = useGetFolderBySlugQuery(slug, { skip: !slug });

  const { data: collaborators = [], isLoading: isCollaboratorsLoading } =
    useGetCollaboratorsQuery(folder?.id || "", {
      skip: !folder?.id,
    });

  const [updateFolder, { isLoading: isUpdating }] = useUpdateFolderMutation();
  const [updateCollaborationSettings, { isLoading: isUpdatingSettings }] =
    useUpdateCollaborationSettingsMutation();
  const [deleteFolder, { isLoading: isDeleting }] = useDeleteFolderMutation();
  const [inviteCollaborator] = useInviteCollaboratorMutation();
  const [removeCollaborator] = useRemoveCollaboratorMutation();

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<FolderVisibility>("PUBLIC");
  const [allowCollaboration, setAllowCollaboration] = useState(false);
  const [requireApproval, setRequireApproval] = useState(false);

  // Collaboration State
  const [selectedUser, setSelectedUser] = useState<UserMinimal | null>(null);
  const [inviteRole, setInviteRole] =
    useState<Exclude<FolderRoles, "OWNER">>("VIEWER");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Permissions
  const isOwner = folder?.user?.username === currentUser;
  const userCollaboration = collaborators.find(
    (c) => c.user?.username === currentUser,
  );
  const isEditor = userCollaboration?.role === "EDITOR";
  const canEdit = isOwner || isEditor;

  // Populate form when folder data loads
  useEffect(() => {
    if (folder) {
      setName(folder.name || "");
      setDescription(folder.description || "");
      setVisibility(folder.visibility || "PRIVATE");
      setAllowCollaboration(folder.allowCollaboration ?? false);
      setRequireApproval(folder.requireApproval ?? false);
    }
  }, [folder]);

  // Ensure role is EDITOR if public
  useEffect(() => {
    if (visibility === "PUBLIC" && inviteRole === "VIEWER") {
      setInviteRole("EDITOR");
    }
  }, [visibility, inviteRole]);

  // Loading state
  if (isFolderLoading || isCollaboratorsLoading) {
    return <FolderEditSkeleton />;
  }

  // Error / Not Found state
  if (isError || !folder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
          Folder Not Found
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          The folder you are trying to edit doesn&apos;t exist or has been
          removed.
        </p>
        <button
          onClick={() => router.push("/app/folders")}
          className="px-8 py-2.5 bg-emerald-600 text-white rounded-sm font-medium transition-colors hover:bg-emerald-700 active:bg-emerald-800 text-sm uppercase tracking-wide"
        >
          Back to Folders
        </button>
      </div>
    );
  }

  // Permission denied state
  if (!canEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
        <div className="text-center">
          <h1 className="text-4xl font-medium text-gray-900 dark:text-white mb-3">
            403
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
            You don&apos;t have permission to edit this folder.
          </p>
          <button
            onClick={() => router.push("/app/folders")}
            className="px-8 py-2.5 bg-emerald-600 text-white font-medium rounded-sm hover:bg-emerald-700 transition-colors text-sm uppercase tracking-wide"
          >
            Back to Folders
          </button>
        </div>
      </div>
    );
  }

  const handleInvite = async () => {
    if (!selectedUser || !folder) return;

    try {
      await inviteCollaborator({
        id: folder.id,
        data: {
          userId: selectedUser.id,
          role: inviteRole,
        },
      }).unwrap();
      addNotification(
        "success",
        `Invited @${selectedUser.username} as ${inviteRole}`,
      );
      setSelectedUser(null);
    } catch (err) {
      addNotification(
        "error",
        getErrorMessage(err, "Failed to invite collaborator"),
      );
    }
  };

  const handleRemoveCollaborator = async (collaborator: Collaborator) => {
    if (!folder) return;
    try {
      await removeCollaborator({
        folderId: folder.id,
        collaboratorId: collaborator.id,
      }).unwrap();
      addNotification("success", "Collaborator removed");
    } catch (err) {
      addNotification(
        "error",
        getErrorMessage(err, "Failed to remove collaborator"),
      );
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!folder) return;
    try {
      await deleteFolder(folder.id).unwrap();
      addNotification("success", "Folder deleted successfully");
      setShowDeleteModal(false);
      router.push("/app/folders");
    } catch (err) {
      addNotification("error", getErrorMessage(err, "Failed to delete folder"));
      setShowDeleteModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folder) return;

    try {
      await updateFolder({
        id: folder.id,
        data: {
          name,
          description,
          visibility,
        },
      }).unwrap();

      addNotification("success", "Folder updated successfully");
      router.push(`/app/folders/${folder.slug}`);
    } catch (err) {
      addNotification("error", getErrorMessage(err, "Failed to update folder"));
    }
  };

  const handleCollaborationSettingChange = async (
    setting: "allowCollaboration" | "requireApproval",
    value: boolean,
  ) => {
    if (!folder) return;

    if (setting === "allowCollaboration") {
      setAllowCollaboration(value);
    } else {
      setRequireApproval(value);
    }

    try {
      await updateCollaborationSettings({
        id: folder.id,
        data: {
          allowCollaboration:
            setting === "allowCollaboration" ? value : allowCollaboration,
          requireApproval:
            setting === "requireApproval" ? value : requireApproval,
        },
      }).unwrap();
      addNotification("success", "Settings updated");
    } catch (err) {
      // Rollback on error
      if (setting === "allowCollaboration") {
        setAllowCollaboration(!value);
      } else {
        setRequireApproval(!value);
      }
      addNotification(
        "error",
        getErrorMessage(err, "Failed to update settings"),
      );
    }
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <button
          onClick={() => router.back()}
          className="group flex items-center space-x-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-10 transition-colors text-sm font-medium"
        >
          <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Folder</span>
        </button>

        <div>
          <div className="pb-8 mb-8 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <FiFolder className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
                  Edit Folder
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update your folder details and settings
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-10"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-0 py-2 border-b-2 border-gray-100 dark:border-white/10 focus:border-emerald-500 bg-transparent transition-all outline-none text-xl font-medium text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20"
                  placeholder="e.g. Summer Reading List"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-sm border border-gray-100 dark:border-white/10 focus:border-emerald-500 bg-gray-50/50 dark:bg-white/5 transition-all outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 resize-none text-base"
                  placeholder="What's this folder about?"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                Visibility
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setVisibility("PRIVATE")}
                  className={`flex items-start space-x-4 p-5 rounded-sm border transition-all text-left ${
                    visibility === "PRIVATE"
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5 shadow-none"
                      : "border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`mt-0.5 p-2 rounded-sm ${
                      visibility === "PRIVATE"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-white/5 text-gray-400"
                    }`}
                  >
                    <FiLock className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`font-medium text-base ${
                        visibility === "PRIVATE"
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      Private
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      Only you can see this folder. It won&apos;t appear on your
                      public profile.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("PUBLIC")}
                  className={`flex items-start space-x-4 p-5 rounded-sm border transition-all text-left ${
                    visibility === "PUBLIC"
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5 shadow-none"
                      : "border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`mt-0.5 p-2 rounded-sm ${
                      visibility === "PUBLIC"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-white/5 text-gray-400"
                    }`}
                  >
                    <FiGlobe className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`font-medium text-base ${
                        visibility === "PUBLIC"
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      Public
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      Anyone can see this folder. It will be visible on your
                      public profile.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {isOwner && (
              <div className="pt-8 border-t border-gray-100 dark:border-white/5 space-y-10">
                <div className="space-y-8">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                    <FiUsers className="w-4 h-4 text-emerald-500" />
                    <span>Collaborators</span>
                  </h3>

                  <div className="space-y-8">
                    <div className="space-y-6 pb-8 border-b border-gray-100 dark:border-white/5">
                      <Switch
                        id="allowCollaboration"
                        checked={allowCollaboration}
                        onChange={(val) =>
                          handleCollaborationSettingChange(
                            "allowCollaboration",
                            val,
                          )
                        }
                        label={
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Allow Collaboration
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Allow others to request to contribute to this
                              folder
                            </p>
                          </div>
                        }
                      />

                      {allowCollaboration && (
                        <div className="ml-14 pl-6 border-l-2 border-emerald-500/10 transition-all animate-in fade-in slide-in-from-left-2">
                          <Switch
                            id="requireApproval"
                            checked={requireApproval}
                            onChange={(val) =>
                              handleCollaborationSettingChange(
                                "requireApproval",
                                val,
                              )
                            }
                            label={
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Require Approval
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  You must approve each collaboration request
                                  manually
                                </p>
                              </div>
                            }
                          />
                        </div>
                      )}
                    </div>

                    {allowCollaboration && (
                      <div className="flex flex-col md:flex-row gap-4 items-stretch bg-gray-50/50 dark:bg-white/5 p-4 rounded-sm">
                        <div className="flex-1">
                          <UserSearchInput
                            onSelect={setSelectedUser}
                            excludeUserIds={
                              [
                                folder?.user?.id,
                                ...collaborators.map((c) => c.user?.id),
                              ].filter(Boolean) as string[]
                            }
                          />
                        </div>
                        <select
                          value={inviteRole}
                          onChange={(e) =>
                            setInviteRole(
                              e.target.value as Exclude<FolderRoles, "OWNER">,
                            )
                          }
                          className="px-4 py-2.5 rounded-sm border border-gray-100 dark:border-white/10 focus:border-emerald-500 outline-none text-sm bg-white dark:bg-neutral-900 text-gray-900 dark:text-white font-medium shadow-sm transition-all"
                        >
                          {visibility !== "PUBLIC" && (
                            <option value="VIEWER">Viewer</option>
                          )}
                          <option value="EDITOR">Editor</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleInvite}
                          disabled={!selectedUser}
                          className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-sm hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
                        >
                          <FiPlus className="w-4 h-4" />
                          <span>
                            {selectedUser
                              ? `Invite @${selectedUser.username}`
                              : "Invite"}
                          </span>
                        </button>
                      </div>
                    )}

                    <div className="space-y-1">
                      {collaborators.map((collaborator) => (
                        <div
                          key={collaborator.id}
                          className="flex items-center justify-between p-3 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-sm border-b border-gray-50 dark:border-white/5 last:border-0"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-sm flex items-center justify-center text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 uppercase">
                              {collaborator.user?.username?.[0] || "?"}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                @{collaborator.user?.username || "Unknown User"}
                              </p>
                              <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                                {collaborator.role.toLowerCase()}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveCollaborator(collaborator)
                            }
                            className="p-2 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-500/10 rounded-sm"
                            title="Remove collaborator"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {collaborators.length === 0 && (
                        <div className="text-sm text-gray-400 dark:text-gray-500 italic py-4">
                          No collaborators yet. Invite someone to contribute!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isOwner && (
              <div className="pt-12 border-t border-gray-100 dark:border-white/5">
                <div className="max-w-xl">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-red-500 mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                    Deleting this folder will permanently remove it and all its
                    contents. This action cannot be undone.
                  </p>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-medium rounded-sm border border-red-500/20 transition-all text-sm"
                  >
                    Delete Folder
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-10 border-t border-gray-100 dark:border-white/5 mt-10">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-gray-500 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || isUpdatingSettings || !name.trim()}
                className="flex items-center space-x-2 px-10 py-3 bg-emerald-600 text-white font-medium rounded-sm hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-emerald-500/20"
              >
                {isUpdating || isUpdatingSettings ? (
                  <span className="text-sm">Saving...</span>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-wide">
                      Save Changes
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Folder?"
        message={
          <p className="text-gray-500 dark:text-neutral-400 text-center text-sm">
            Are you sure you want to permanently delete{" "}
            <span className="font-bold text-gray-600 dark:text-gray-300">
              "{name}"
            </span>
            ?
          </p>
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        isDanger={true}
      />
    </div>
  );
}
