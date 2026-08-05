"use client";
import React from "react";
import LogoIcon from "@/app/assets/icons/logo.svg";
import LogoStackedIcon from "@/app/assets/icons/logo-stacked-1.svg";
import LogoStacked2Icon from "@/app/assets/icons/logo-stacked-2.svg";

/**
 * These components use the imported SVG source files via SVGR.
 * The config in next.config.ts (dimensions: false) ensures that the SVGs 
 * don't have fixed width/height and instead fill their containers.
 */

type LogoProps = { 
  className?: string; 
  title?: string;
  width?: number | string;
  height?: number | string;
};

export const Logo = (p: LogoProps) => (
  <LogoIcon
    width={p.width}
    height={p.height}
    className={p.className}
    role="img"
    aria-label={p.title ?? "Shelf"}
  />
);

export const LogoStacked = (p: LogoProps) => (
  <LogoStackedIcon
    width={p.width}
    height={p.height}
    className={p.className}
    role="img"
    aria-label={p.title ?? "Shelf"}
  />
);

export const LogoStacked2 = (p: LogoProps) => (
  <LogoStacked2Icon
    width={p.width}
    height={p.height}
    className={p.className}
    role="img"
    aria-label={p.title ?? "Shelf"}
  />
);

export default Logo;
