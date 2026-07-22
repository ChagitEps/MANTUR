import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "צור קשר — MANTUR",
  description: "יצירת קשר עם MANTUR — שאלות, הצעות ופניות.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <StaticPage title="צור קשר">
      <p>
        נשמח לשמוע מכם — שאלה, הצעה לשיפור, דיווח על תקלה או פנייה עסקית.
      </p>

      <h2>אימייל</h2>
      <p>
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        <br />
        נשתדל לחזור אליכם תוך ימי עסקים ספורים.
      </p>

      <h2>לפני שכותבים</h2>
      <ul>
        <li>
          לגבי הזמנה קיימת — ההזמנה והתשלום מתבצעים באתר השותף, ולכן לשינוי,
          ביטול או בירור על הזמנה יש לפנות ישירות לספק שאצלו הזמנתם.
        </li>
        <li>לשאלות על השירות, יעדים או שיתופי פעולה — נשמח לעזור כאן.</li>
      </ul>
    </StaticPage>
  );
}
