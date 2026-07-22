import Link from "next/link";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
  { href: "/terms", label: "תקנון" },
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/cookies", label: "Cookies" },
  { href: "/disclosure", label: "גילוי נאות" },
];

/** Footer קבוע — ניווט לעמודים סטטיים + גילוי נאות אפיליאט (חובה, סעיף 8). */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <nav
          aria-label="ניווט תחתון"
          className="mb-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-muted">
          {SITE.name} הוא שירות השוואה. ההזמנה והתשלום מתבצעים תמיד באתר השותף,
          ואנו עשויים לקבל עמלה — ללא עלות נוספת לכם.
        </p>
        <p className="mt-3 text-center text-xs text-muted">
          © {year} {SITE.name} · {SITE.tagline}
        </p>
      </div>
    </footer>
  );
}
