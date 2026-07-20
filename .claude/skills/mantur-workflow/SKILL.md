---
name: mantur-workflow
description: Working conventions for the MANTUR travel platform. Use at the start of ANY development task on this project — before writing code, planning a feature, creating files, or answering how something should be built. Covers spec source-of-truth order, naming, folder structure, TypeScript rules, error/logging policy, and the "never invent requirements" rule.
---

# MANTUR — Way of Working

MANTUR היא פלטפורמת חיפוש נסיעות בעברית לשוק הישראלי. אפיליאט (לא OTA) — הזמנות ותשלום תמיד אצל השותף.

## לפני שכותבים קוד
1. **קרא את האפיון** `afyun-travel-site-v2-agent.md` — זהו **מקור האמת היחיד** למוצר.
2. **בעת סתירה** בין הקוד לאפיון — האפיון קובע. `afyun-travel-site-v2.md` (ללא ה-`-agent`) הוא גרסה **ישנה ומיושנת** — אין להסתמך עליו.
3. **לא להמציא דרישות חסרות.** כשדרישה לא ברורה — לעצור ולשאול את המשתמשת, לא לנחש.
4. **לא prototype מהיר.** כל החלטה נשקלת לתחזוקה ארוכת-טווח. Enterprise quality.

## סטאק
Next.js 16 (App Router) · TypeScript strict · Supabase (Postgres + Auth + Storage + RLS) · Tailwind v4 · Anthropic Claude API (`claude-sonnet-5`) · Travelpayouts.
לספציפיקה פר-שכבה השתמש ב-Skills: `mantur-database`, `mantur-backend`, `mantur-frontend`, `mantur-security`.

## מוסכמות שמות ותיקיות
- קבצים ותיקיות: `kebab-case`. קומפוננטות React: `PascalCase`. משתנים/פונקציות: `camelCase`. קבועים: `UPPER_SNAKE`. טבלאות DB: `snake_case` ברבים.
- תיקיות מרכזיות: `app/` (routes), `components/` (UI חוזר), `lib/` (utils), `providers/` (אינטגרציות חיצוניות מבודדות), `supabase/migrations/`.
- מודולריות: כל מודול (Flight, Hotel, Package, Deals, User, AI, Affiliate, CMS) עצמאי — אחריות אחת לכל אחד.

## TypeScript
- `strict: true`. אין `any` (השתמש ב-`unknown` + narrowing). טיפוסים מפורשים על גבולות (API, props, DB rows).
- ולידציה עם `zod` בכל גבול קלט; להסיק טיפוסים מהסכמה (`z.infer`).

## שגיאות ו-Logging
- למשתמש: **הודעה ידידותית בעברית בלבד** — לעולם לא stack trace, שגיאת API, או קוד טכני.
- לתעד כל שגיאה קריטית עם `timestamp`, `request_id`, `source`, `message`, `context`.
- ספק חיצוני נכשל → להציע "נסה שוב" / חיפוש אחר; לא להפיל את כל הדף.

## איכות (Definition of Done לכל פיצ'ר)
- RTL + עברית. Responsive (Desktop/Tablet/Mobile). נגישות WCAG 2.2 AA.
- מצבי Loading / Empty / Error מטופלים. אירועי Analytics נשלחים (ראה סעיף 14 — אנליטיקס/KPIs — באפיון).
- אין מפתחות/secrets בצד לקוח. אין קישורים שבורים.

## עקרונות בל-יעברו
- Provider-independent: לוגיקה עסקית לא תלויה בספק יחיד — הכל דרך שכבת `providers/`.
- Transparency: המערכת לא ממציאה/משנה/מחשבת מחירים. מציגה נתוני ספק כפי שהתקבלו.
- User first: הכנסות אפיליאט אף פעם לא על חשבון אמון המשתמש או שקיפות.
- **מצבים אופציונליים ללא עומס:** תכונות לקהל ספציפי (כמו מצב דתי/כשר) הן **opt-in, כבויות כברירת מחדל**. מי שלא בחר בהן לא רואה אותן — בלי תוספת ויזואלית לחוויה הרגילה.
