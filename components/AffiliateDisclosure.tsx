import Link from "next/link";

const TEXT =
  "MANTUR הוא שירות השוואה. ההזמנה והתשלום מתבצעים תמיד באתר השותף, ואנו עשויים לקבל עמלה — ללא עלות נוספת לכם.";

/**
 * גילוי נאות אפיליאט — קבוע ונגיש (חובה אתית/רגולטורית, סעיף 8 באפיון).
 * `inline` — שורה דקה בעמודי תוצאות. `footer` — בתחתית כל עמוד.
 */
export function AffiliateDisclosure({
  variant = "inline",
}: {
  variant?: "inline" | "footer";
}) {
  if (variant === "footer") {
    return (
      <footer className="mt-auto border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 text-center text-xs text-muted">
          <p>{TEXT}</p>
          <p className="mt-2">
            <Link href="/" className="hover:text-foreground">
              MANTUR
            </Link>{" "}
            · מנוע נסיעות ישראלי
          </p>
        </div>
      </footer>
    );
  }

  return (
    <p
      role="note"
      className="rounded-lg border border-border bg-black/[0.02] px-3 py-2 text-xs text-muted"
    >
      {TEXT}
    </p>
  );
}
