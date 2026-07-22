import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "מדיניות פרטיות — MANTUR",
  description: "כיצד MANTUR אוסף ומשתמש במידע.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <StaticPage title="מדיניות פרטיות" updated="יולי 2026">
      <p>
        אנו מכבדים את פרטיותכם. מדיניות זו מסבירה איזה מידע נאסף בעת השימוש
        ב-{SITE.name} וכיצד אנו משתמשים בו.
      </p>

      <h2>איזה מידע נאסף</h2>
      <ul>
        <li>
          <strong>נתוני שימוש אנונימיים:</strong> אנו משתמשים ב-Vercel Analytics
          למדידת תנועה (צפיות בעמודים, חיפושים, קליקים) באופן מצטבר. המדידה
          פרטיות-תחילה וללא Cookies, ואיננו אוספים דרכה מידע מזהה אישית.
        </li>
        <li>
          <strong>פרטי חיפוש:</strong> יעד, תאריכים ומספר נוסעים שאתם מזינים —
          משמשים להצגת תוצאות בלבד.
        </li>
        <li>
          <strong>פנייה יזומה:</strong> אם תפנו אלינו במייל, נשמור את הפרטים
          שמסרתם לצורך מענה.
        </li>
      </ul>

      <h2>שירותי צד שלישי</h2>
      <ul>
        <li>
          <strong>שותפים (Travelpayouts ואתרי הזמנה):</strong> בלחיצה על ״המשך
          להזמנה״ אתם עוברים לאתר השותף, הכפוף למדיניות הפרטיות שלו. השותפים
          עשויים להשתמש ב-Cookies לזיהוי ההפניה ולחישוב עמלה.
        </li>
        <li>
          <strong>אירוח (Vercel):</strong> האתר מתארח ב-Vercel, שעשוי לאסוף
          נתונים טכניים בסיסיים (כגון כתובת IP) לצורך אבטחה ותפעול.
        </li>
      </ul>

      <h2>שימוש במידע</h2>
      <p>
        המידע משמש להפעלת השירות, לשיפורו ולמענה לפניות. איננו מוכרים מידע אישי
        לצדדים שלישיים.
      </p>

      <h2>זכויותיכם</h2>
      <p>
        אתם רשאים לפנות אלינו בבקשה לעיין במידע שנשמר עליכם, לתקנו או למחקו.
        לפרטים: <Link href="/contact">צרו קשר</Link>.
      </p>

      <h2>Cookies</h2>
      <p>
        לפירוט על עוגיות ראו <Link href="/cookies">מדיניות Cookies</Link>.
      </p>

      <p className="text-sm text-muted">
        אין באמור ייעוץ משפטי. מסמך זה הוא תבנית כללית שיש להתאים לפעילות ולדין
        הרלוונטי.
      </p>
    </StaticPage>
  );
}
