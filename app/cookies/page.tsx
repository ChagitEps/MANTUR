import type { Metadata } from "next";
import Link from "next/link";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "מדיניות Cookies — MANTUR",
  description: "כיצד MANTUR משתמש בעוגיות (Cookies).",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <StaticPage title="מדיניות Cookies" updated="יולי 2026">
      <p>
        ״עוגיות״ (Cookies) הן קבצים קטנים שאתר עשוי לשמור בדפדפן שלכם. הדף מסביר
        כיצד {SITE.name} מתייחס אליהן.
      </p>

      <h2>מה אנחנו עושים</h2>
      <p>
        {SITE.name} שואף למינימום עוגיות. מדידת התנועה שלנו (Vercel Analytics)
        היא <strong>ללא Cookies</strong> ואינה מזהה אתכם אישית. ייתכן שימוש
        בעוגיות תפקודיות חיוניות בלבד לצורך הפעלה תקינה של האתר.
      </p>

      <h2>עוגיות של שותפים</h2>
      <p>
        כאשר אתם עוברים לאתר שותף (למשל לביצוע הזמנה), אותו אתר עשוי להציב עוגיות
        משלו — בין היתר כדי לזהות שההפניה הגיעה מ-{SITE.name} ולחשב עמלה. עוגיות
        אלה כפופות למדיניות של השותף, לא שלנו.
      </p>

      <h2>ניהול עוגיות</h2>
      <p>
        אתם יכולים לחסום או למחוק עוגיות דרך הגדרות הדפדפן. חסימה עשויה לפגוע
        בחלק מהפונקציונליות.
      </p>

      <p>
        למידע נוסף ראו <Link href="/privacy">מדיניות פרטיות</Link>.
      </p>
    </StaticPage>
  );
}
