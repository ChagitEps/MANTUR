import Link from "next/link";

const NAV = [
  { label: "טיסות", href: "#" },
  { label: "מלונות", href: "#" },
  { label: "דילים", href: "#" },
  { label: "יעדים", href: "#" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          MANTUR
        </Link>
        <nav aria-label="ניווט ראשי" className="hidden gap-6 text-sm sm:flex">
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} className="hover:opacity-70">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
