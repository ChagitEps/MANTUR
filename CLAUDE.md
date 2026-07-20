@AGENTS.md

# MANTUR — Project Memory

מנוע נסיעות ישראלי בעברית. מודל אפיליאט (לא OTA) — הזמנה ותשלום תמיד אצל השותף.

## מקור אמת
- **האפיון הקנוני היחיד:** `afyun-travel-site-v2-agent.md`. לא להמציא דרישות — בעת ספק, לעצור ולשאול.
- **מוסכמות פיתוח:** מוגדרות ב-Skills תחת `.claude/skills/mantur-*` (workflow, database, backend, frontend, security). הן נטענות אוטומטית — לפעול לפיהן.
- `afyun-travel-site-v2.md` (ללא `-agent`) — **מיושן**, אין להסתמך עליו.

## סטאק
Next.js 16 (App Router) · TypeScript strict · Tailwind v4 · Supabase (Postgres+Auth+Storage+RLS) · Anthropic Claude API (`claude-sonnet-5`) · Travelpayouts. אירוח: Vercel.

## עקרונות בל-יעברו
- **RTL + עברית** כברירת מחדל (`dir="rtl"`, logical properties).
- **Provider-independent:** כל קריאה ל-Travelpayouts/ספק חיצוני דרך שכבת `providers/` בלבד.
- **Secrets בצד שרת בלבד** — בלי `NEXT_PUBLIC_` למפתחות.
- **לא לשמור מחירי טיסה/מלון כמקור אמת** — רק cache עם TTL; המחיר הקובע הוא של הספק בזמן החיפוש.
- כל תצוגת נתונים: מצבי Loading / Empty / Error. נגישות WCAG 2.2 AA.

## סדר בנייה (MVP — שלב 1 באפיון)
תשתית → שכבת Provider ל-Travelpayouts → דף הבית (Hero + בר חיפוש + טוגל חו"ל/בארץ) → תוצאות + עמוד פרט + handoff מתויג → 3 עמודי יעד (SEO) + גילוי נאות.
