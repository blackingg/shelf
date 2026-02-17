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
} from "@/app/store/api/foldersApi";
import { getErrorMessage } from "@/app/helpers/error";
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
  const [deleteFolder, { isLoading: isDeleting }] = useDeleteFolderMutation();
  const [inviteCollaborator] = useInviteCollaboratorMutation();
  const [removeCollaborator] = useRemoveCollaboratorMutation();

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<FolderVisibility>("PUBLIC");

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
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Folder Not Found
        </h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6 max-w-sm">
          The folder you are trying to edit doesn&apos;t exist or has been
          removed.
        </p>
        <button
          onClick={() => router.push("/app/folders")}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md font-medium transition-colors hover:bg-emerald-700 active:bg-emerald-800"
        >
          Back to Folders
        </button>
      </div>
    );
  }

  // Permission denied state
  if (!canEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-3">
            403
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6 max-w-sm">
            You don&apos;t have permission to edit this folder.
          </p>
          <button
            onClick={() => router.push("/app/folders")}
            className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
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

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <button
          onClick={() => router.back()}
          className="group group-hover:underline flex items-center space-x-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Folder</span>
        </button>

        <div>
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/10 rounded-md flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-900/20">
                <FiFolder className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
                  Edit Folder
                </h1>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Update your folder details and settings
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 space-y-8"
          >
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Folder Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-neutral-800 focus:border-emerald-500 bg-transparent transition-all outline-none text-gray-900 dark:text-white font-medium placeholder-gray-400"
                placeholder="e.g. Summer Reading List"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-neutral-800 focus:border-emerald-500 bg-transparent transition-all outline-none text-gray-900 dark:text-white font-medium placeholder-gray-400 resize-none"
                placeholder="What's this folder about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
                Visibility
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setVisibility("PRIVATE")}
                  className={`flex items-start space-x-4 p-4 rounded-md border-2 transition-all text-left ${
                    visibility === "PRIVATE"
                      ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-white/5"
                      : "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div
                    className={`mt-1 p-2 rounded-md ${
                      visibility === "PRIVATE"
                        ? "bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-white"
                        : "bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400"
                    }`}
                  >
                    <FiLock className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        visibility === "PRIVATE"
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-neutral-300"
                      }`}
                    >
                      Private
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                      Only you can see this folder. It won&apos;t appear on your
                      public profile.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("PUBLIC")}
                  className={`flex items-start space-x-4 p-4 rounded-md border-2 transition-all text-left ${
                    visibility === "PUBLIC"
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/5"
                      : "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div
                    className={`mt-1 p-2 rounded-md ${
                      visibility === "PUBLIC"
                        ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600"
                        : "bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400"
                    }`}
                  >
                    <FiGlobe className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        visibility === "PUBLIC"
                          ? "text-emerald-900 dark:text-emerald-400"
                          : "text-gray-700 dark:text-neutral-300"
                      }`}
                    >
                      Public
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                      Anyone can see this folder. It will be visible on your
                      public profile.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {isOwner && (
              <div className="border-t border-gray-100 dark:border-white/5 pt-8">
                <label className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FiUsers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Collaborators</span>
                </label>

                <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-md p-4 md:p-6 space-y-6 border border-gray-100 dark:border-white/5">
                  <div className="flex flex-col md:flex-row gap-4">
                    <UserSearchInput
                      onSelect={setSelectedUser}
                      excludeUserIds={
                        [
                          folder?.user?.id,
                          ...collaborators.map((c) => c.user?.id),
                        ].filter(Boolean) as string[]
                      }
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) =>
                        setInviteRole(
                          e.target.value as Exclude<FolderRoles, "OWNER">,
                        )
                      }
                      className="px-4 py-2.5 rounded-md border border-gray-200 dark:border-neutral-700 focus:border-emerald-500 outline-none text-sm bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
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
                      className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-md hover:bg-black dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>
                        {selectedUser
                          ? `Invite @${selectedUser.username}`
                          : "Invite"}
                      </span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {collaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-white/5"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-md flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20 uppercase">
                            {collaborator.user?.username?.[0] || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              @{collaborator.user?.username || "Unknown User"}
                            </p>
                            <span className="text-xs text-gray-400 dark:text-neutral-500 capitalize">
                              {collaborator.role.toLowerCase()}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCollaborator(collaborator)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors"
                          title="Remove collaborator"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {collaborators.length === 0 && (
                      <div className="text-center py-4 text-sm text-gray-500 dark:text-neutral-400 italic">
                        No collaborators yet. Invite someone to contribute to
                        this folder!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isOwner && (
              <div className="border-t border-gray-100 dark:border-white/5 pt-8">
                <h3 className="text-red-600 dark:text-red-400 font-medium mb-2">
                  Danger Zone
                </h3>
                <p className="text-gray-500 dark:text-neutral-400 text-xs mb-4">
                  Deleting this folder will permanently remove it and all its
                  contents. This action cannot be undone.
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-2.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-medium rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete Folder
                </button>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-gray-500 dark:text-neutral-400 font-medium hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || !name.trim()}
                className="flex items-center space-x-2 px-8 py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span>Save Changes</span>
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
