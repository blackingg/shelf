import { useMemo } from "react";
import { useUser } from "@/app/services";
import { checkIsOwner } from "@/app/helpers";

/**
 * Hook to check if the current authenticated user is the owner of a resource.
 * It compares both IDs (primary) and usernames (fallback) for robustness.
 *
 * @param owner - The owner object from the resource (e.g., book.donor, folder.user)
 * @returns boolean indicating if the current user is the owner
 */
export const useIsOwner = (
  owner?: string | { id: string; username?: string } | null,
) => {
  const { me } = useUser();

  return useMemo(() => checkIsOwner(me, owner), [me, owner]);
};
