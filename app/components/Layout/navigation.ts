/**
 * Shared route-matching for the desktop Sidebar and the mobile BottomTabBar —
 * kept in one place so they can't drift.
 */

export const isNavActive = (pathname: string, href: string): boolean => {
  if (pathname === href) return true;

  // Prevent "My Library" from being active on categories/departments sub-routes
  if (
    href === "/library" &&
    (pathname.startsWith("/library/categories") ||
      pathname.startsWith("/library/departments"))
  ) {
    return false;
  }

  // Prevent "Discover" from matching other /app/* routes
  if (href === "/discover" && pathname !== "/discover") {
    return false;
  }

  return pathname.startsWith(`${href}/`);
};
