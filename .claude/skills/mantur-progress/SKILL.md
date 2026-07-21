---
name: mantur-progress
description: Current build progress and next steps for the MANTUR project — what is already built, what is still pending, and the ordered MVP roadmap. Use at the start of a MANTUR session, or whenever the user asks "what did we do / where are we / what's next". IMPORTANT: update this file at the end of each build step so it stays accurate.
---

# MANTUR — התקדמות ומצב נוכחי

> קובץ **חי** — לעדכן בסוף כל שלב בנייה כדי שיישאר מדויק.

## מה כבר נבנה ✅
- שלד **Next.js 16** (App Router, Turbopack) + TS strict + **Tailwind v4**, RTL/עברית (Rubik) — `app/layout.tsx`.
- מבנה תיקיות: `components/`, `lib/`, `providers/`, `supabase/migrations/`.
- **עיצוב בהיר** (globals.css: מצב כהה מנוטרל, פלטה בהירה + `--brand` תכלת).
- **דף בית** (`app/page.tsx`): Header + Hero + בר חיפוש (`components/SearchBar.tsx`) — טוגל חו״ל/בארץ, לשוניות טיסות/מלונות, נגיש+RTL. **widgets עשירים:**
  - `components/LocationInput.tsx` → `/api/places` (route שלנו): **חיפוש בעברית** מרשימה מתורגמת (`lib/travel/places-he.ts`, ~65 יעדים) + fallback לאנגלית (Travelpayouts). TP לא מחזיר עברית, לכן הרשימה הידנית.
  - `components/DateRangeField.tsx` — לוח שנה עם טווח (react-day-picker v10, locale he, RTL); "עד מתי" ממלא את תיבת החזרה.
  - `components/GuestsField.tsx` — סטפר נוסעים; במלונות גם **חדרים**.
  - `lib/hooks/useClickOutside.ts`. deps חדשים: `react-day-picker`, `date-fns`.
- **שכבת Provider** (provider-independence):
  - `providers/types.ts` — חוזה `TravelProvider` (link builders ל-handoff, client-safe, marker ציבורי).
  - `providers/travelpayouts/index.ts` — deep-links מתויגים (Aviasales search-code / Hotellook).
  - `providers/travelpayouts/data.ts` — **server-only** (`import "server-only"`): `searchFlights()` מול Aviasales Data API (`api.travelpayouts.com/aviasales/v3/prices_for_dates`), אימות ב-header `X-Access-Token`, cache 15 דק'.
  - `lib/travel/types.ts` — טיפוסי חיפוש + `FlightResult`.
- **עמוד תוצאות טיסות** (`app/flights/`): Server Component שמושך נתונים אמיתיים ומציג בעמוד שלנו — כרטיסי טיסה (`components/FlightResultCard.tsx`) עם מחיר/חברה/מסלול, כפתור **"המשך להזמנה"** → handoff מתויג. מצבי loading/empty/error. ✔ אומת חי: ₪418, marker=742034 בהפניה.
  - **עמוד פרטי טיסה** (`app/flights/detail/`) — מסלול הלוך/חזור, שעות, חברה, עצירות, משך, מחיר (re-fetch מה-cache לפי `fid`). כפתור "המשך להזמנה" → Aviasales מתויג. פונקציות פורמט משותפות ב-`lib/travel/format.ts`.
  - **זרימה:** חיפוש → `/flights` → "צפייה בפרטים" → `/flights/detail` (הכל אצלנו) → "המשך להזמנה" → השותף לקנייה.
  - **תמונת יעד** בראש עמוד הטיסות (hero): `lib/travel/destination-image.ts` מושך תמונה מ-Wikipedia REST (חינם, בלי מפתח) — עברית→he.wikipedia, אחרת en; cache ליום. `next.config.ts` מתיר `upload.wikimedia.org`. `SearchBar` מעביר `destName`; העמוד מרנדר `<Image fill>` עם כותרת "טיסות ל<יעד>". ✔ אומת: לונדון (he) + Paris (en), optimizer מחזיר 200.
  - הערה: השוואת מוכרים מלאה בעמוד שלנו דורשת את Aviasales Flight Search API (נפתח רק ב-50K MAU) — עתידי, לא חסם עסקי.
- **Travelpayouts**: Project + **marker 742034** + **API token** — ב-`.env.local` (מוחרג מ-git). marker גם ב-`NEXT_PUBLIC_TRAVELPAYOUTS_MARKER`.
- `CLAUDE.md` + Skills (`mantur-*`) מכוונים לאפיון `afyun-travel-site-v2-agent.md`. git+GitHub: `ChagitEps/MANTUR`.

## מה כבר נבנה — המשך ✅
- **עמוד תוצאות מלונות** (`app/hotels/`, `components/HotelResultCard.tsx`, `searchHotels` ב-data.ts) — כמו טיסות: תוצאות בעמוד שלנו + "המשך להזמנה" מתויג. בר החיפוש (מלונות) → `/hotels`.
- **שדרוגי חיפוש**: מוצא ברירת מחדל **TLV (תל אביב)** ב-`SearchBar` (עדיין ניתן לשינוי); `SearchBar` מקבל `initialDestination` (לעמודי יעד). `DateRangeField` — **2 חודשים בדסקטופ**, הדגשת התיבה הפעילה, זרימת "יציאה→ממתין לחזרה" (בלי ברירת מחדל).
- **גילוי נאות אפיליאט** (`components/AffiliateDisclosure.tsx`) — וריאנט `footer` קבוע ב-`app/layout.tsx` (כל עמוד) + `inline` בעמודי טיסות/מלונות/יעד. חובה אתית/רגולטורית (סעיף 8).
- **עמודי יעד (SEO)** (`app/destinations/[slug]/`, `lib/travel/destinations.ts`) — 3 יעדים (בודפשט/לונדון/רומא), **SSG אינדקסבילי** (title/description עבריים, canonical). כל עמוד: hero תמונת יעד + מדריך (מתי לטוס/מה לעשות) + **טבלת "הטיסות הזולות מתל אביב ל…"** (searchFlights, cache 15 דק') + בר חיפוש מוטמע מכוון ליעד + גילוי נאות. ✔ אומת חי: בודפשט ₪205+.

## מה חסר / חוסם ⏳
- **אימות נתוני מלונות** — `engine.hotellook.com` **חוסם את ה-IP המקומי** (404), אז לא אומת מקומית. העמוד מרונדר עם error state נקי (פרסינג הגנתי). **לאמת מהדפדפן של המשתמשת (IP לא חסום) או מ-Vercel.**
- Supabase, Anthropic — לשלבים מאוחרים.

## הרצה
`npm run dev` → http://localhost:3000 (צריך `.env.local` עם ה-token; אחרי שינוי env — restart לשרת).

## סדר בנייה (MVP — שלב 1)
1. ✅ תשתית + דף בית.
2. ✅ שכבת Provider + handoff מתויג.
3. ✅ **עמוד תוצאות טיסות** (נתונים אמיתיים בעמוד שלנו + אישור→handoff).
4. ⏭️ **עמוד תוצאות מלונות** (Hotellook Data API — לבדוק מ-Vercel/דפדפן).
5. אוטוקומפליט ערים→IATA; route `/api/go` לתיעוד קליקים+analytics.
6. עמודי יעד (SEO) + גילוי נאות → סוגר שלב 1.

## הצעד הבא
עמוד תוצאות מלונות (כמו טיסות), או אוטוקומפליט ערים. לבדוק את Hotellook Data API מ-Vercel (לא חסום שם) — לכן שווה לפרוס.
