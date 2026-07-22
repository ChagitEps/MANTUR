/**
 * הגדרות אתר מרכזיות — נקודת עריכה אחת לפרטים שחוזרים בעמודים הסטטיים.
 * TODO(המשתמשת): להחליף את הערכים המסומנים בפרטים אמיתיים לפני עלייה לאוויר.
 */
export const SITE = {
  name: "MANTUR",
  tagline: "מנוע נסיעות ישראלי",
  url: "https://mantur-delta.vercel.app",
  // TODO: החליפי לאימייל יצירת קשר אמיתי (עדיף כתובת ייעודית, לא אישית).
  contactEmail: "info@mantur.co.il",
  // TODO: אם קיימת ישות משפטית/עוסק מורשה — למלא שם וח.פ/ע.מ.
  legalEntity: "MANTUR",
} as const;
