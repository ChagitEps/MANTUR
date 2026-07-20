---
name: mantur-security
description: Security, authorization, and privacy conventions for the MANTUR travel platform — authentication, roles/permissions, secrets handling, rate limiting, CSRF, input validation, safe error exposure, and privacy compliance (GDPR + Israeli Privacy Law Amendment 13). Use when building auth flows, admin gating, forms, API endpoints, or anything handling secrets or personal data.
---

# MANTUR — Security & Privacy

## אימות והרשאות
- **Supabase Auth (JWT).** אימות חובה לפיצ'רים אישיים בלבד — חיפוש עובד גם ללא התחברות.
- **Authorization נאכף בצד שרת + RLS.** לעולם לא לסמוך על הלקוח לסינון/הסתרה.
- Roles: `visitor` / `user` / `agent` / `admin`. כל פעולה ניהולית דורשת `admin`.
- ניסיון גישה של לא-admin לאזור ניהול → **403** (לא לחשוף שהמשך קיים).
- Session שפגה/Token שפג-תוקף → הפניה להתחברות מחדש, עם שמירת הדף האחרון וחזרה אליו.
- **לוח בקרה לסוכן (`/admin`)** = אזור **admin/agent בלבד** — נאכף בשרת + RLS. נתוני ההזמנות/עמלות מסונכרנים מ-Travelpayouts בעיכוב, לכן העמלה מוצגת מפוצלת "מאושר" מול "ממתין" (לא להציג ממתין כמאושר). אם multi-tenant — כל סוכן רואה רק את ה-SubID שלו (policy פר-סוכן).

## Secrets
- **כל מפתחות ה-API, ה-secrets ו-DB credentials בצד שרת בלבד.** אין `NEXT_PUBLIC_` למידע רגיש. מפתחות מוצגים באדמין חלקית בלבד — ניתן להחליף, לא לקרוא.
- כל התקשורת HTTPS.

## קלט ובקשות
- **ולידציה (`zod`) בכל קלט** — טפסים, query params, body של API.
- **CSRF protection** על כל mutation.
- **Rate limiting** על חיפוש, טפסים ציבוריים, ו-AI endpoint (הגנה מ-spam וניצול לרעה של טפסים).

## חשיפת שגיאות
- למשתמש: הודעה ידידותית בלבד. **בלי stack trace, שגיאת API, קוד שגיאה טכני, או מידע פנימי.**
- אירועי אבטחה (API key שגוי, ניסיון גישה לא-מורשה, חריגת rate-limit) → נרשמים ב-log **בלי לדלוף** את הפרטים למשתמש. Stack trace בלוגים גלוי ל-admin בלבד.

## AI
- ה-AI endpoint מוגבל לתחום נסיעות ועמיד ל-prompt injection (system prompt חוסם יציאה מהתחום; מגבלת אורך קלט). אין להחדיר מפתחות/הוראות רגישות דרך הודעות משתמש.

## פרטיות ורגולציה
- עמידה ב-**GDPR** וב-**תיקון 13 לחוק הגנת הפרטיות הישראלי (בתוקף אוגוסט 2025)** — רלוונטי במיוחד לאיסוף אימיילים (ניוזלטר/התראות) ולחשבונות משתמש.
- ניהול הסכמה (Cookies/consent), אפשרות **Download My Data** ו-**Delete My Account**, ומדיניות שמירת מידע ל-soft-deleted users (ראה `mantur-database`).
- **גילוי נאות affiliate** קבוע ונגיש (חובה אתית ורגולטורית).

מקור האמת למוצר הוא `afyun-travel-site-v2-agent.md`; Skill זה מספק את מוסכמות האבטחה.
