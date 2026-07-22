"use client";

import { trackPartnerClick } from "@/lib/analytics/track";

/**
 * קישור handoff לשותף שמודד את הקליק (Vercel Analytics) לפני היציאה.
 * `rel="nofollow sponsored"` — תקין ל-SEO/אפיליאט. ה-marker כבר בתוך ה-href.
 */
export function PartnerLink({
  href,
  kind,
  destination,
  className,
  children,
}: {
  href: string;
  kind: "flight" | "hotel";
  destination?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener nofollow sponsored"
      onClick={() => trackPartnerClick(kind, { destination })}
      className={className}
    >
      {children}
    </a>
  );
}
