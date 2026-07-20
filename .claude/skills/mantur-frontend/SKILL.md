---
name: mantur-frontend
description: Frontend/UI conventions for the MANTUR travel platform — Next.js App Router pages, React components, Tailwind styling, RTL Hebrew, accessibility, and SEO. Use when building any page, component, layout, or styling. Enforces mandatory Loading/Empty/Error states, WCAG 2.2 AA, and reuse of the shared component library.
---

# MANTUR — Frontend (Next.js UI)

## בסיס
- Next.js 16 App Router + TypeScript + Tailwind v4.
- **RTL + עברית כברירת מחדל**: `dir="rtl"`, שימוש ב-logical properties (`ms-`/`me-`/`ps-`/`pe-`, `start`/`end`) ולא `left`/`right`.
- **Mobile-first**: לעצב מהמובייל כלפי מעלה. Desktop/Tablet/Mobile — ראה עקרונות העיצוב בסעיף 8 באפיון.
- Server Components כברירת מחדל. `"use client"` רק כשצריך state/אינטראקטיביות. אין קריאות API עם מפתחות מהלקוח.

## מצבים — חובה בכל תצוגת נתונים
כל רכיב שמושך נתונים חייב לטפל בשלושת המצבים (דרישה חוצת-מסכים — ראה "מצבים" בסעיפים 6.1/6.3 באפיון):
- **Loading**: Skeleton (מועדף) או Spinner. לעולם לא מסך ריק בזמן המתנה.
- **Empty**: מסר ידידותי + הצעת פעולה (למשל "לא נמצאו טיסות — נסה תאריך אחר / לכל מקום / בקשה לסוכן").
- **Error**: הודעה ידידותית + "נסה שוב". בלי stack trace / קוד שגיאה.

## קומפוננטות
- **שימוש חוזר בספריית הקומפוננטות** (סעיף 8 באפיון): בר חיפוש, כרטיס תוצאה, כרטיס דיל, פאנל פילטרים, לוח מחירים, מפה, בועות צ'אט, באנר גילוי נאות. **אין ליצור רכיב חדש כשקיים מתאים.**
- קומפוננטה = אחריות אחת, props מוקלדים, ללא לוגיקת fetch של מפתחות בצד לקוח.

## נגישות (WCAG 2.2 AA)
- כל שדה נגיש למקלדת; כל כפתור עם תיאור/`aria-label`; כל תמונה עם `alt`; כל הודעת שגיאה נקראת ע"י screen reader (`aria-live`); ניגודיות תקינה; תמיכה ב-`prefers-reduced-motion`.

## SEO
- לכל עמוד ציבורי: `metadata` (Title, Description, Canonical, Open Graph, Twitter). Structured Data רלוונטי (Organization/Website/SearchAction לבית; Article לבלוג; breadcrumb).
- **עמודי תוצאות חיפוש**: `noindex, nofollow` (דינמיים). התנועה האורגנית מגיעה מעמודי תוכן/יעד, לא מתוצאות.

## תמונות וביצועים
- `next/image` + lazy-load לתמונות, מפות, גלריות, גרפים. אין קריאות API כפולות (למשל לחיצות חיפוש חוזרות → בקשה אחת).

## תצוגת מחירים
- להציג מחירי ספק **כפי שהתקבלו** — בלי חישוב/עיגול מקומי. שינוי מחיר מאז החיפוש → להציג "המחיר התעדכן", לא להסתיר.
