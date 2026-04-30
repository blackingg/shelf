"use client";
import React, { useState, useEffect, useRef } from "react";
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
  FiEdit2,
  FiCheck,
} from "react-icons/fi";
import { useNotifications } from "@/app/context/NotificationContext";
import { useFolderPermissions } from "@/app/hooks/useFolderPermissions";
import {
  FolderVisibility,
  FolderRoles,
  Collaborator,
  FolderPermission,
} from "@/app/types/folder";
import { UserMinimal } from "@/app/types/user";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import UserSearchInput from "@/app/components/UserSearchInput";
import {
  useFolderBySlug,
  useCollaborators,
  useFolderInvites,
  useFolderActions,
} from "@/app/services";
import FolderEditSkeleton from "@/app/components/Skeletons/FolderEditSkeleton";

export default function EditFolderPage() {
  const params = useParams();
  const router = useRouter();
  const slug =
    typeof params.slug === "string" ? params.slug : params.slug?.[0] || "";
  const { addNotification } = useNotifications();

  // API Hooks
  const {
    folder,
    isLoading: isFolderLoading,
    isFetching: isFolderFetching,
    isError,
  } = useFolderBySlug(slug);
  const { collaborators, isLoading: isCollaboratorsLoading } = useCollaborators(
    folder?.id || "",
  );
  const { invites, isLoading: isInvitesLoading } = useFolderInvites(
    folder?.id || "",
  );
  const { actions, isUpdating, isUpdatingSettings, isDeleting } =
    useFolderActions();

  const {
    isOwner,
    canEditFolder,
    canDeleteFolder,
    canManageCollaborators,
    canChangeVisibility,
  } = useFolderPermissions(folder);

  const canEdit = canEditFolder;

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
  const [activeTab, setActiveTab] = useState<"collaborators" | "invites">(
    "collaborators",
  );
  const [invitePermissions, setInvitePermissions] = useState<
    FolderPermission[]
  >(["ADD_BOOKS", "REMOVE_BOOKS"]);

  const [showInvitePermissions, setShowInvitePermissions] = useState(false);
  const inviteDropdownRef = useRef<HTMLDivElement>(null);

  const [editingCollaboratorId, setEditingCollaboratorId] = useState<
    string | null
  >(null);
  const [editingRole, setEditingRole] = useState<FolderRoles>("VIEWER");
  const [editingPermissions, setEditingPermissions] = useState<
    FolderPermission[]
  >([]);
  const [editingProfileId, setEditingProfileId] = useState("");

  type PermissionProfile = {
    id: string;
    label: string;
    role: Exclude<FolderRoles, "OWNER">;
    permissions: FolderPermission[];
    description: string;
  };

  const AVAILABLE_PERMISSIONS: { id: FolderPermission; label: string }[] = [
    { id: "ADD_BOOKS", label: "Add Books" },
    { id: "REMOVE_BOOKS", label: "Remove Books" },
    { id: "EDIT_FOLDER", label: "Edit Details" },
    { id: "DELETE_FOLDER", label: "Delete Folder" },
    { id: "MANAGE_COLLABORATORS", label: "Manage People" },
    { id: "CHANGE_VISIBILITY", label: "Change Privacy" },
  ];

  const ACCESS_PROFILES_BY_VISIBILITY: Record<
    FolderVisibility,
    PermissionProfile[]
  > = {
    PRIVATE: [
      {
        id: "private_reader",
        label: "Reader",
        role: "VIEWER",
        permissions: [],
        description: "Can view content only",
      },
      {
        id: "private_contributor",
        label: "Contributor",
        role: "EDITOR",
        permissions: ["ADD_BOOKS", "REMOVE_BOOKS"],
        description: "Can add and remove books",
      },
      {
        id: "private_curator",
        label: "Curator",
        role: "EDITOR",
        permissions: ["ADD_BOOKS", "REMOVE_BOOKS", "EDIT_FOLDER"],
        description: "Can manage books and details",
      },
      {
        id: "private_admin",
        label: "Administrator",
        role: "EDITOR",
        permissions: AVAILABLE_PERMISSIONS.map((p) => p.id),
        description: "Full collaboration access",
      },
    ],
    PUBLIC: [
      {
        id: "public_contributor",
        label: "Contributor",
        role: "EDITOR",
        permissions: ["ADD_BOOKS", "REMOVE_BOOKS"],
        description: "Can add and remove books",
      },
      {
        id: "public_curator",
        label: "Curator",
        role: "EDITOR",
        permissions: ["ADD_BOOKS", "REMOVE_BOOKS", "EDIT_FOLDER"],
        description: "Can manage books and details",
      },
      {
        id: "public_admin",
        label: "Administrator",
        role: "EDITOR",
        permissions: AVAILABLE_PERMISSIONS.map((p) => p.id),
        description: "Full management access",
      },
    ],
    UNLISTED: [],
  };

  const DEFAULT_PROFILE_BY_VISIBILITY: Record<FolderVisibility, string> = {
    PRIVATE: "private_contributor",
    PUBLIC: "public_contributor",
    UNLISTED: "private_contributor",
  };

  const [hasInitialized, setHasInitialized] = useState(false);
  const [activeProfile, setActiveProfile] = useState(
    DEFAULT_PROFILE_BY_VISIBILITY.PUBLIC,
  );

  const getAvailableProfiles = (
    targetVisibility: FolderVisibility = visibility,
  ) =>
    ACCESS_PROFILES_BY_VISIBILITY[targetVisibility] ||
    ACCESS_PROFILES_BY_VISIBILITY.PRIVATE;

  const getDefaultProfileId = (
    targetVisibility: FolderVisibility = visibility,
  ) =>
    DEFAULT_PROFILE_BY_VISIBILITY[targetVisibility] ||
    DEFAULT_PROFILE_BY_VISIBILITY.PRIVATE;

  const getProfileById = (
    profileId: string,
    targetVisibility: FolderVisibility = visibility,
  ) =>
    getAvailableProfiles(targetVisibility).find(
      (profile) => profile.id === profileId,
    );

  const getProfileForAccess = (
    role: Exclude<FolderRoles, "OWNER">,
    permissions: FolderPermission[] = [],
    targetVisibility: FolderVisibility = visibility,
  ) => {
    const sortedPermissions = [...permissions].sort().join("|");
    return getAvailableProfiles(targetVisibility).find((profile) => {
      const profilePermissions = [...profile.permissions].sort().join("|");
      return profile.role === role && profilePermissions === sortedPermissions;
    });
  };

  const applyInviteProfile = (
    profileId: string,
    targetVisibility: FolderVisibility = visibility,
  ) => {
    const profile = getProfileById(profileId, targetVisibility);
    if (!profile) return;
    setActiveProfile(profile.id);
    setInviteRole(profile.role);
    setInvitePermissions(profile.permissions);
  };

  const applyEditingProfile = (
    profileId: string,
    targetVisibility: FolderVisibility = visibility,
  ) => {
    const profile = getProfileById(profileId, targetVisibility);
    if (!profile) return;
    setEditingProfileId(profile.id);
    setEditingRole(profile.role);
    setEditingPermissions(profile.permissions);
  };

  const collaborationMode: "NONE" | "REQUESTS" | "OPEN" = !allowCollaboration
    ? "NONE"
    : requireApproval
      ? "REQUESTS"
      : "OPEN";

  const isDirty =
    name !== (folder?.name || "") ||
    description !== (folder?.description || "") ||
    visibility !== (folder?.visibility || "PRIVATE");

  // Populate form when folder data loads
  useEffect(() => {
    // Initial load: sync everything
    if (folder && !hasInitialized) {
      setName(folder.name || "");
      setDescription(folder.description || "");
      const initialVisibility = folder.visibility || "PRIVATE";
      setVisibility(initialVisibility);
      setAllowCollaboration(folder.allowCollaboration ?? false);
      setRequireApproval(folder.requireApproval ?? false);
      applyInviteProfile(
        getDefaultProfileId(initialVisibility),
        initialVisibility,
      );
      setHasInitialized(true);
    }

    // Refresh synchronization: only sync if not currently updating AND not fetching background updates
    if (folder && hasInitialized && !isUpdatingSettings && !isFolderFetching) {
      setVisibility(folder.visibility || "PRIVATE");
      setAllowCollaboration(folder.allowCollaboration ?? false);
      setRequireApproval(folder.requireApproval ?? false);
    }
  }, [folder, hasInitialized, isUpdatingSettings, isFolderFetching]);

  useEffect(() => {
    const activeProfileInVisibility = getProfileById(activeProfile, visibility);
    if (activeProfileInVisibility) {
      applyInviteProfile(activeProfileInVisibility.id, visibility);
      return;
    }

    applyInviteProfile(getDefaultProfileId(visibility), visibility);
  }, [visibility]);

  // Click outside for invite dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inviteDropdownRef.current &&
        !inviteDropdownRef.current.contains(event.target as Node)
      ) {
        setShowInvitePermissions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Loading state
  if (isFolderLoading || isCollaboratorsLoading || isInvitesLoading) {
    return <FolderEditSkeleton />;
  }

  // Error / Not Found state
  if (isError || !folder) {
    return (
      <div className="p-6 md:p-10 bg-white dark:bg-neutral-900 min-h-[60vh]">
        <div className="max-w-4xl mx-auto border border-gray-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900 px-6 py-10 sm:px-8 sm:py-12">
          <div className="max-w-xl text-left space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>404 folder missing</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center justify-center">
                <FiFolder className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
                Folder Not Found
              </h2>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
              The folder you are trying to edit does not exist.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/app/library?tab=folders")}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-md text-sm font-medium transition-colors hover:bg-emerald-700 active:bg-emerald-800"
              >
                Back to Library
              </button>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
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
            You do not have permission to edit this folder.
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
    await actions.inviteCollaborator(
      folder.id,
      selectedUser.id,
      inviteRole,
      invitePermissions as any,
    );
    setSelectedUser(null);
    applyInviteProfile(
      activeProfile || getDefaultProfileId(visibility),
      visibility,
    );
    setShowInvitePermissions(false);
    setActiveTab("invites");
  };

  const handleRemoveCollaborator = async (collaborator: Collaborator) => {
    if (!folder) return;
    await actions.removeCollaborator(folder.id, collaborator.id);
  };

  const handleUpdateCollaborator = async (collaboratorId: string) => {
    if (!folder) return;
    await actions.updatePermissions(folder.id, collaboratorId, {
      role: editingRole as any,
      permissions: editingPermissions,
    });
    setEditingCollaboratorId(null);
  };

  const startEditingCollaborator = (collaborator: Collaborator) => {
    setEditingCollaboratorId(collaborator.id);
    setEditingRole(collaborator.role);
    setEditingPermissions(collaborator.permissions || []);

    const matchingProfile = getProfileForAccess(
      collaborator.role,
      collaborator.permissions || [],
      visibility,
    );
    applyEditingProfile(
      matchingProfile?.id || getDefaultProfileId(visibility),
      visibility,
    );
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!folder) return;
    await actions.deleteFolder(folder.id);
    setShowDeleteModal(false);
    router.push("/app/folders");
  };

  const handleVisibilityChange = async (newVisibility: FolderVisibility) => {
    if (!folder || newVisibility === visibility) return;
    setVisibility(newVisibility);
    await actions.updateFolder(folder.id, { visibility: newVisibility });
  };

  const handleFieldSave = async (field: "name" | "description") => {
    if (!folder) return;
    await actions.updateFolder(folder.id, {
      [field]: field === "name" ? name : description,
    });
  };

  const handleCollaborationUpdate = async (
    mode: "NONE" | "REQUESTS" | "OPEN",
  ) => {
    if (!folder) return;

    const newAllowCollaboration = mode !== "NONE";
    const newRequireApproval = mode === "REQUESTS";

    // Optimistic update
    setAllowCollaboration(newAllowCollaboration);
    setRequireApproval(newRequireApproval);

    try {
      await actions.updateSettings(folder.id, {
        allowCollaboration: newAllowCollaboration,
        requireApproval: newRequireApproval,
      });
    } catch (err) {
      // Revert on error
      setAllowCollaboration(folder.allowCollaboration);
      setRequireApproval(folder.requireApproval);
    }
  };

  const activeInviteProfile =
    getProfileById(activeProfile, visibility) ||
    getProfileById(getDefaultProfileId(visibility), visibility);

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

        <div className="pb-8 mb-8 border-b border-gray-100 dark:border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-10"
        >
          <div className="space-y-10">
            {/* Folder Name */}
            <div className="space-y-3">
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Folder Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-0 py-2 border-b-2 border-gray-100 dark:border-white/10 focus:border-emerald-500 bg-transparent transition-all outline-none text-xl font-medium text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 pb-4"
                  placeholder="e.g. Summer Reading List"
                  required
                />
                {name !== (folder?.name || "") && (
                  <div className="flex items-center space-x-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      type="button"
                      onClick={() => handleFieldSave("name")}
                      disabled={isUpdating || !name.trim()}
                      className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
                    >
                      {isUpdating ? "Saving..." : "Save Name"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setName(folder?.name || "")}
                      className="px-4 py-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs font-medium transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Description
              </label>
              <div className="space-y-4">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-sm border border-gray-100 dark:border-white/10 focus:border-emerald-500 bg-gray-50 dark:bg-white/5 transition-all outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 resize-none text-base"
                  placeholder="What's this folder about?"
                />
                {description !== (folder?.description || "") && (
                  <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      type="button"
                      onClick={() => handleFieldSave("description")}
                      disabled={isUpdating}
                      className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
                    >
                      {isUpdating ? "Saving..." : "Save Description"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescription(folder?.description || "")}
                      className="px-4 py-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs font-medium transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Visibility
            </label>
            <div className="space-y-4">
              <div className="inline-flex p-1 bg-gray-100 dark:bg-white/5 rounded-sm">
                <button
                  type="button"
                  onClick={() => handleVisibilityChange("PRIVATE")}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-sm text-sm font-medium transition-all ${
                    visibility === "PRIVATE"
                      ? "bg-emerald-600 text-white shadow-none"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  <FiLock className="w-4 h-4" />
                  <span>Private</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleVisibilityChange("PUBLIC")}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-sm text-sm font-medium transition-all ${
                    visibility === "PUBLIC"
                      ? "bg-emerald-600 text-white shadow-none"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  <FiGlobe className="w-4 h-4" />
                  <span>Public</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                {visibility === "PRIVATE"
                  ? "Only you can see this folder. It won't appear on your public profile or in searches."
                  : "Anyone can see this folder and its contents. It will be visible on your public profile."}
              </p>
            </div>
          </div>

          {canManageCollaborators && (
            <div className="pt-8 border-t border-gray-100 dark:border-white/5 space-y-10">
              <div className="space-y-8">
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                  <FiUsers className="w-4 h-4 text-emerald-500" />
                  <span>Collaboration Settings</span>
                </h3>

                <div className="space-y-8">
                  {/* Collaboration Mode Selector */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleCollaborationUpdate("NONE")}
                      className={`flex flex-col p-4 rounded-sm border transition-all text-left ${
                        collaborationMode === "NONE"
                          ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5"
                          : "border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${collaborationMode === "NONE" ? "bg-emerald-500" : "bg-gray-300 dark:bg-neutral-700"}`}
                        />
                        <span
                          className={`text-sm font-medium ${collaborationMode === "NONE" ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                        >
                          Disabled
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-neutral-500 leading-relaxed">
                        No one can contribute or join.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCollaborationUpdate("REQUESTS")}
                      className={`flex flex-col p-4 rounded-sm border transition-all text-left ${
                        collaborationMode === "REQUESTS"
                          ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5"
                          : "border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${collaborationMode === "REQUESTS" ? "bg-emerald-500" : "bg-gray-300 dark:bg-neutral-700"}`}
                        />
                        <span
                          className={`text-sm font-medium ${collaborationMode === "REQUESTS" ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                        >
                          Invitations
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-neutral-500 leading-relaxed">
                        Users must accept your invite to join.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCollaborationUpdate("OPEN")}
                      className={`flex flex-col p-4 rounded-sm border transition-all text-left ${
                        collaborationMode === "OPEN"
                          ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5"
                          : "border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${collaborationMode === "OPEN" ? "bg-emerald-500" : "bg-gray-300 dark:bg-neutral-700"}`}
                        />
                        <span
                          className={`text-sm font-medium ${collaborationMode === "OPEN" ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                        >
                          Direct Add
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-neutral-500 leading-relaxed">
                        Users are added to the folder immediately.
                      </p>
                    </button>
                  </div>

                  {collaborationMode !== "NONE" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col md:flex-row gap-4 items-stretch bg-gray-50 dark:bg-white/5 p-4 rounded-sm relative">
                        <div className="flex-1">
                          <UserSearchInput
                            onSelect={setSelectedUser}
                            selectedUser={selectedUser}
                            excludeUserIds={
                              [
                                folder?.user?.id,
                                ...collaborators.map((c) => c.user?.id),
                              ].filter(Boolean) as string[]
                            }
                          />
                        </div>

                        <div
                          className="relative"
                          ref={inviteDropdownRef}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setShowInvitePermissions(!showInvitePermissions)
                            }
                            className="h-full px-4 py-2.5 rounded-sm border border-gray-100 dark:border-white/10 flex items-center justify-between gap-3 bg-white dark:bg-neutral-900 text-sm font-medium hover:border-emerald-500/50 transition-all min-w-[140px]"
                          >
                            <span className="text-gray-900 dark:text-white uppercase tracking-wider text-[11px] font-bold">
                              {activeInviteProfile?.label || "Profile"}
                            </span>
                            <div className="w-4 h-4 text-gray-400">
                              <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </button>

                          {showInvitePermissions && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/10 rounded-sm shadow-xl z-50 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                  Access Profile
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                  {getAvailableProfiles(visibility).map(
                                    (profile) => (
                                      <button
                                        key={profile.id}
                                        type="button"
                                        onClick={() =>
                                          applyInviteProfile(
                                            profile.id,
                                            visibility,
                                          )
                                        }
                                        className={`w-full p-3 rounded-sm text-left transition-all border ${activeProfile === profile.id ? "bg-emerald-500/10 border-emerald-500/40" : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-emerald-500/40"}`}
                                      >
                                        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-900 dark:text-white">
                                          {profile.label}
                                        </p>
                                        <p className="text-[10px] text-gray-500 dark:text-neutral-400 mt-1">
                                          {profile.description}
                                        </p>
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleInvite}
                          disabled={!selectedUser}
                          className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-sm hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
                        >
                          <FiPlus className="w-4 h-4" />
                          <span>
                            {selectedUser
                              ? `${collaborationMode === "OPEN" ? "Add" : "Invite"} @${selectedUser.username}`
                              : collaborationMode === "OPEN"
                                ? "Add"
                                : "Invite"}
                          </span>
                        </button>
                      </div>

                      {/* List Tabs */}
                      <div className="space-y-4">
                        <div className="flex border-b border-gray-100 dark:border-white/5">
                          <button
                            type="button"
                            onClick={() => setActiveTab("collaborators")}
                            className={`px-4 py-3 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 -mb-[2px] ${
                              activeTab === "collaborators"
                                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            Collaborators ({collaborators.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("invites")}
                            className={`px-4 py-3 text-xs uppercase tracking-widest font-medium transition-colors border-b-2 -mb-[2px] ${
                              activeTab === "invites"
                                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            Pending Invites ({invites.length})
                          </button>
                        </div>

                        <div className="space-y-0.5">
                          {activeTab === "collaborators" ? (
                            <>
                              {(collaborators.length > 0
                                ? collaborators
                                : folder?.collaborators || []
                              ).map((collaborator) => (
                                <div
                                  key={collaborator.id}
                                  className={`flex flex-col gap-2 py-4 px-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-sm group ${editingCollaboratorId === collaborator.id ? "bg-emerald-50/30 dark:bg-emerald-500/5 ring-1 ring-emerald-500/20" : ""}`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${collaborator.role === "EDITOR" ? "bg-purple-500" : "bg-blue-500"}`}
                                    />
                                    <div className="flex-1 min-w-0 text-left">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          @
                                          {collaborator.user?.username ||
                                            "User"}
                                        </p>
                                        {!collaborator.acceptedAt && (
                                          <span className="text-[10px] text-amber-600 dark:text-amber-500 font-medium uppercase tracking-wider">
                                            • Pending
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">
                                          {collaborator.role.toLowerCase()}
                                        </p>
                                        <span className="text-[10px] text-gray-300 dark:text-white/10">
                                          |
                                        </span>
                                        <p className="text-[10px] text-gray-400 dark:text-neutral-500 truncate">
                                          {collaborator.permissions?.length ||
                                            0}{" "}
                                          capabilities
                                        </p>
                                      </div>
                                    </div>

                                    {editingCollaboratorId ===
                                    collaborator.id ? (
                                      <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleUpdateCollaborator(
                                              collaborator.id,
                                            )
                                          }
                                          className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 rounded-sm transition-all"
                                          title="Save changes"
                                        >
                                          <FiCheck className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setEditingCollaboratorId(null)
                                          }
                                          className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm transition-all"
                                          title="Cancel"
                                        >
                                          <FiX className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            startEditingCollaborator(
                                              collaborator,
                                            )
                                          }
                                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-sm transition-all"
                                          title="Edit permissions"
                                        >
                                          <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveCollaborator(
                                              collaborator,
                                            )
                                          }
                                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-sm transition-all"
                                          title="Remove collaborator"
                                        >
                                          <FiX className="w-4 h-4" />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {editingCollaboratorId ===
                                    collaborator.id && (
                                    <div className="mt-4 pt-4 border-t border-emerald-500/10 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                      <div className="space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                          Access Profile
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {getAvailableProfiles(visibility).map(
                                            (profile) => (
                                              <button
                                                key={profile.id}
                                                type="button"
                                                onClick={() =>
                                                  applyEditingProfile(
                                                    profile.id,
                                                    visibility,
                                                  )
                                                }
                                                className={`p-3 rounded-sm text-left transition-all border ${editingProfileId === profile.id ? "bg-emerald-500/10 border-emerald-500/40" : "bg-white dark:bg-neutral-900 border-gray-100 dark:border-white/10 hover:border-emerald-500/30"}`}
                                              >
                                                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-900 dark:text-white">
                                                  {profile.label}
                                                </p>
                                                <p className="text-[10px] text-gray-500 dark:text-neutral-400 mt-1">
                                                  {profile.description}
                                                </p>
                                              </button>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {collaborators.length === 0 &&
                                (!folder?.collaborators ||
                                  folder.collaborators.length === 0) && (
                                  <div className="text-sm text-gray-400 dark:text-gray-500 italic py-6 px-4">
                                    No collaborators yet. Invite someone to
                                    start building this folder together.
                                  </div>
                                )}
                            </>
                          ) : (
                            <>
                              {invites.map((invite) => (
                                <div
                                  key={invite.id}
                                  className="flex items-center gap-4 py-4 px-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-sm group"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50 shrink-0" />
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        @{invite.user?.username || "User"}
                                      </p>
                                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">
                                        •{" "}
                                        {invite.status?.toLowerCase() ||
                                          "invited"}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 capitalize bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded-sm font-bold mt-1 inline-block">
                                      {invite.role.toLowerCase()}
                                    </p>
                                    <p className="text-[9px] text-gray-400 mt-1">
                                      Sent{" "}
                                      {new Date(
                                        invite.createdAt,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {invites.length === 0 && (
                                <div className="text-sm text-gray-400 dark:text-gray-500 italic py-6 px-4">
                                  No pending invites.
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {canDeleteFolder && (
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

          {/* Empty space after danger zone */}
          <div className="pt-20" />
        </form>
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
