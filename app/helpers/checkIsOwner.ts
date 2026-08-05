/**
 * Centralized logic to check if a user is the owner of a resource.
 * Can be used in both hooks and plain functions.
 */
export const checkIsOwner = (
  me: { id: string; uuid?: string; username?: string } | null | undefined,
  owner: string | { id?: string; uuid?: string; username?: string } | null | undefined,
) => {
  if (!me || !owner) return false;

  // Support direct ID comparison (string)
  if (typeof owner === "string") {
    return me.id === owner || me.uuid === owner;
  }

  // Prioritize ID comparison
  if (me.id && owner.id) {
    return me.id === owner.id;
  }

  // Fallback to username comparison
  if (me.username && owner.username) {
    return me.username === owner.username;
  }

  return false;
};
