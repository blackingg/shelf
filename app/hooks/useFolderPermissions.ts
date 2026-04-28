import { useMemo } from "react";
import { useGetMeQuery } from "@/app/services";
import { Folder, FolderPermission } from "@/app/types/folder";
import { useIsOwner } from "./useIsOwner";
import { checkIsOwner } from "@/app/helpers";

export const hasFolderPermission = (
  folder: Folder | null | undefined,
  currentUser: any,
  permission: FolderPermission,
): boolean => {
  if (!folder || !currentUser) return false;

  const isOwner = checkIsOwner(
    currentUser,
    folder?.user || (folder as any)?.userId,
  );
  if (isOwner) return true;

  const collaboration = folder.collaborators?.find((c) =>
    checkIsOwner(currentUser, c.user),
  );

  if (!collaboration) return false;
  return collaboration.permissions.includes(permission);
};

export const useFolderPermissions = (folder: Folder | null | undefined) => {
  const { data: currentUser } = useGetMeQuery();

  return useMemo(() => {
    const hasPermission = (perm: FolderPermission) =>
      hasFolderPermission(folder, currentUser, perm);

    // Check if owner
    const isOwner = useIsOwner(folder?.user || (folder as any)?.userId);

    // Check collaborator status
    const collaboration = folder?.collaborators?.find((c) =>
      checkIsOwner(currentUser, c.user),
    );

    const isCollaborator = !!collaboration;
    const role = isOwner ? "OWNER" : collaboration?.role || null;
    const permissions = isOwner
      ? ([
          "ADD_BOOKS",
          "REMOVE_BOOKS",
          "EDIT_FOLDER",
          "DELETE_FOLDER",
          "MANAGE_COLLABORATORS",
          "CHANGE_VISIBILITY",
        ] as FolderPermission[])
      : collaboration?.permissions || [];

    return {
      isOwner,
      isCollaborator,
      role,
      permissions,
      canAddBooks: hasPermission("ADD_BOOKS"),
      canRemoveBooks: hasPermission("REMOVE_BOOKS"),
      canEditFolder: hasPermission("EDIT_FOLDER"),
      canDeleteFolder: hasPermission("DELETE_FOLDER"),
      canManageCollaborators: hasPermission("MANAGE_COLLABORATORS"),
      canChangeVisibility: hasPermission("CHANGE_VISIBILITY"),
      canViewSettings:
        isOwner ||
        hasPermission("EDIT_FOLDER") ||
        hasPermission("MANAGE_COLLABORATORS"),
    };
  }, [folder, currentUser]);
};
