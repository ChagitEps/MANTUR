---
name: mantur-backend
description: Backend conventions for the MANTUR travel platform — API route handlers, server actions, external travel providers (Travelpayouts), caching, affiliate link generation, and the AI chat endpoint. Use when building any server-side logic, integrating an external API, generating affiliate links, or wiring the Claude AI assistant. Enforces provider isolation and server-only secrets.
---

# MANTUR — Backend (API + Providers)

## מבנה
- Next.js Route Handlers (`app/api/**/route.ts`) או Server Actions. אין לוגיקה עסקית בקומפוננטות לקוח.
- ולידציה עם `zod` על כל בקשה נכנסת לפני עיבוד. קלט לא תקין → 400 עם הודעה ידידותית.

## שכבת Provider (עיקרון-על — provider independence)
- **כל קריאה לספק חיצוני (Travelpayouts Flights/Hotels, Aviasales Data) עוברת דרך interface ב-`providers/`.** אסור לקרוא ל-API החיצוני ישירות מ-route handler, server action או קומפוננטה.
- כל provider חושף פונקציות אחידות (`searchFlights`, `searchHotels`, `getDeals`...) עם טיפוסי-דומיין פנימיים — לא צורת ה-JSON הגולמית של הספק. החלפת ספק בעתיד = מימוש חדש של אותו interface, בלי שינוי בשאר המערכת.
- קריאות ספק: `timeout` + `retry` מוגדרים; תוצאות חלקיות מותרות (חלק מהספקים נכשל → החזר את מה שכן התקבל, אל תפיל את כל החיפוש).

## Secrets
- **כל מפתחות ה-API בצד שרת בלבד.** לעולם לא `NEXT_PUBLIC_` למפתח/secret. קריאה מ-`process.env` בקוד שרת בלבד.

## Caching
- cache לתוצאות חיפוש לביצועים בלבד, עם TTL. לעולם לא להגיש נתון שפג-תוקף כעדכני. מחירים אינם מקור אמת (ראה `mantur-database`).

## מטריצת תאריכים גמישים (חיפוש גילוי — יקר בקריאות) — אפיון 6.2 + סיכון 17
- מנוע ה"גילוי" (מטריצת יעד×תאריך, "החודש/היום הזול", "לכל מקום") מייצר **ריבוי קריאות מחיר** — סיכון עלות ו-rate-limit מול Aviasales/Kiwi ברמת אפיליאט.
- **לפני מימוש**: לאמת את המכסה ומגבלת הקצב של הספק. מיטיגציה חובה: caching אגרסיבי (TTL ארוך יותר לנתוני גילוי), **הגבלת רוחב המטריצה** (מספר יעדים/תאריכים לכל שליפה), טעינה מדורגת, ו-debounce על קלט המשתמש. לא לפתוח קריאה פר-תא בלי batching/תקרה.

## Affiliate
- יצירת קישורי affiliate **ריכוזית** ב-`lib/affiliate` — לא מפוזרת בקוד. כל deep-link כולל `marker` + `SubID` (פר-מיקום/מקור) + `locale=he` + `currency=ils`.
- כל מעבר לאתר שותף נרשם (click tracking + analytics event) — גם אם לא בוצעה רכישה.
- כישלון יצירת קישור → לא להעביר לקישור שבור; להציג הודעה ולתעד ב-log.

## AI Assistant Endpoint — אפיון 6.6 + 10
- Endpoint ייעודי (למשל `app/api/chat/route.ts`). מודל: `claude-sonnet-5` (Anthropic). המפתח בצד שרת בלבד.
- **פענוח מובנה**: Structured Outputs (`output_config.format` עם json_schema) לחילוץ `{origin, destination, dates, budget, scope}` — לא פרסינג טקסט חופשי.
- **Prompt caching**: system prompt קבוע (בלי תאריך/מזהה משתנה בתחילתו) + `cache_control` — מנגנון בקרת העלות המרכזי.
- **thinking**: לצ'אט מהיר וזול — `thinking: {type: "disabled"}` או `effort: low`.
- **Streaming** לתגובות. מגבלת אורך קלט + rate-limit + תקרת הוצאה חודשית.
- **Guardrail**: הבוט מוגבל לתחום נסיעות בלבד ועמיד ל-prompt injection (ראה `mantur-security`). ה-AI לעולם לא ממציא מחירים/זמינות/דילים — מפנה לחיפוש אמיתי.

## שגיאות
לתפוס שגיאות ספק, להחזיר הודעה ידידותית, לתעד עם `request_id`, ולא לדלוף פרטים טכניים ללקוח (ראה `mantur-workflow`).
