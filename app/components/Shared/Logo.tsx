"use client";
import React, { useEffect, useState } from "react";

function useSvg(src: string): string | null {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(src)
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => {
        if (!cancelled) setSvg(text);
      })
      .catch(() => {
        if (!cancelled) setSvg(null);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  return svg;
}

function normalizeSvg(svg: string): string {
  return svg.replace(
    /<svg/,
    '<svg width="100%" height="100%" style="display:block"',
  );
}

interface SvgIconProps {
  src: string;
  className?: string;
  title?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({ src, className, title }) => {
  const raw = useSvg(src);

  if (!raw) return null;

  return (
    <span
      role="img"
      aria-label={title}
      className={["inline-block", className].filter(Boolean).join(" ")}
      style={{ lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: normalizeSvg(raw) }}
    />
  );
};

const LOGOS = {
  Logo: "/logo.svg",
  LogoStacked: "/logo-stacked-1.svg",
  LogoStacked2: "/logo-stacked-2.svg",
} as const;

type LogoProps = { className?: string; title?: string };

export const Logo = (p: LogoProps) => (
  <SvgIcon
    src={LOGOS.Logo}
    title={p.title ?? "Shelf"}
    className={p.className}
  />
);
export const LogoStacked = (p: LogoProps) => (
  <SvgIcon
    src={LOGOS.LogoStacked}
    title={p.title ?? "Shelf"}
    className={p.className}
  />
);
export const LogoStacked2 = (p: LogoProps) => (
  <SvgIcon
    src={LOGOS.LogoStacked2}
    title={p.title ?? "Shelf"}
    className={p.className}
  />
);

export default Logo;
