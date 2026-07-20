/**
 * Stable per-user identity for namespacing the persisted React Query cache.
 *
 * The persisted cache must be isolated per user (so a second user on a shared
 * device never sees the first user's cached folders/bookmarks) AND stable across
 * access-token refreshes (so the offline cache isn't discarded every hour when a
 * new access token is issued). The access token satisfies neither on its own —
 * it rotates on refresh — so we key on the user id instead, which is stable for
 * the life of the session and unique per user.
 */
const ACTIVE_UID_KEY = "shelf-active-uid";

/** Records the signed-in user's id so the cache namespace stays stable. */
export function setActiveIdentity(userId: string | undefined | null): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    window.localStorage.setItem(ACTIVE_UID_KEY, userId);
  } catch {
    // Storage unavailable — namespacing falls back to "guest".
  }
}

/** Reads the current stable identity, or "guest" when signed out. */
export function getActiveIdentity(): string {
  if (typeof window === "undefined") return "guest";
  try {
    return window.localStorage.getItem(ACTIVE_UID_KEY) || "guest";
  } catch {
    return "guest";
  }
}

/** Clears the identity marker on logout. */
export function clearActiveIdentity(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACTIVE_UID_KEY);
  } catch {
    // no-op
  }
}

/**
 * Whether this browser had a signed-in session that wasn't explicitly logged
 * out. Unlike the accessToken cookie (which expires hourly), this persists for
 * as long as the refresh token could still be valid — use it to decide whether
 * a session is worth attempting to resume, not just whether it's live right now.
 */
export function hasStoredIdentity(): boolean {
  return getActiveIdentity() !== "guest";
}
