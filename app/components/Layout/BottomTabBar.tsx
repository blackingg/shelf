"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IoBriefcase,
  IoBriefcaseOutline,
  IoCompass,
  IoCompassOutline,
  IoLibrary,
  IoLibraryOutline,
  IoLogIn,
  IoLogInOutline,
  IoMenu,
  IoMenuOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";
import { useUser } from "@/app/services";
import { isNavActive } from "./navigation";
import { MoreDrawer } from "./MoreDrawer";

interface TabItem {
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  href: string;
}

const tabClass = (active: boolean) =>
  `flex-1 flex flex-col items-center justify-center gap-1 active:bg-pressed transition-colors ${
    active ? "text-primary" : "text-muted"
  }`;

const TabContent: React.FC<{ label: string; icon: React.ReactNode }> = ({
  label,
  icon,
}) => (
  <>
    <span className="w-5 h-5 flex items-center justify-center text-[20px]">
      {icon}
    </span>
    <span className="text-[10px] font-medium leading-none">{label}</span>
  </>
);

export const BottomTabBar: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useUser();
  const [showMore, setShowMore] = useState(false);

  const tabs: TabItem[] = isAuthenticated
    ? [
        {
          label: "Discover",
          icon: <IoCompassOutline />,
          activeIcon: <IoCompass />,
          href: "/discover",
        },
        {
          label: "Library",
          icon: <IoLibraryOutline />,
          activeIcon: <IoLibrary />,
          href: "/library",
        },
        {
          label: "Search",
          icon: <IoSearchOutline />,
          activeIcon: <IoSearch />,
          href: "/search",
        },
      ]
    : [
        {
          label: "Discover",
          icon: <IoCompassOutline />,
          activeIcon: <IoCompass />,
          href: "/discover",
        },
        {
          label: "Departments",
          icon: <IoBriefcaseOutline />,
          activeIcon: <IoBriefcase />,
          href: "/library/departments",
        },
        {
          label: "Search",
          icon: <IoSearchOutline />,
          activeIcon: <IoSearch />,
          href: "/search",
        },
        {
          label: "Log in",
          icon: <IoLogInOutline />,
          activeIcon: <IoLogIn />,
          href: "/auth/login",
        },
      ];

  return (
    <>
      <nav
        className="lg:hidden shrink-0 bg-surface border-t border-line safe-area-bottom"
        aria-label="Primary"
      >
        <div className="flex items-stretch h-14">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-center gap-1.5"
              >
                <div className="w-5 h-5 bg-wash rounded-md animate-pulse" />
                <div className="w-10 h-2 bg-wash rounded-md animate-pulse" />
              </div>
            ))
          ) : (
            <>
              {tabs.map((tab) => {
                const active = isNavActive(pathname, tab.href) && !showMore;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={tabClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    <TabContent
                      label={tab.label}
                      icon={active ? tab.activeIcon : tab.icon}
                    />
                  </Link>
                );
              })}
              {isAuthenticated && (
                <button
                  onClick={() => setShowMore(true)}
                  className={tabClass(showMore)}
                  aria-label="Open menu"
                  aria-expanded={showMore}
                >
                  <TabContent
                    label="More"
                    icon={showMore ? <IoMenu /> : <IoMenuOutline />}
                  />
                </button>
              )}
            </>
          )}
        </div>
      </nav>

      <MoreDrawer
        isOpen={showMore}
        onClose={() => setShowMore(false)}
      />
    </>
  );
};
