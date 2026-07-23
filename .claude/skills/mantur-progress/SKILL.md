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
  - `providers/travelpayouts/index.ts` — deep-links מתויגים **בעברית** (Aviasales search-code עם `marker`+`currency=ils`+`locale=he`; Hotellook עם `language=he`). כל הפניה לשותף בעברית.
  - `providers/travelpayouts/data.ts` — **server-only** (`import "server-only"`): `searchFlights()` מול Aviasales Data API (`api.travelpayouts.com/aviasales/v3/prices_for_dates`), אימות ב-header `X-Access-Token`, cache 15 דק'.
  - `lib/travel/types.ts` — טיפוסי חיפוש + `FlightResult`.
- **עמוד תוצאות טיסות** (`app/flights/`): Server Component שמושך נתונים אמיתיים ומציג בעמוד שלנו — כרטיסי טיסה (`components/FlightResultCard.tsx`) עם **לוח זמנים מלא הלוך+חזור** (`components/FlightItinerary.tsx`: שעות המראה/נחיתה, עצירות לכל רגל, משך), מחיר, חברה, מקור הזמנה; כפתור **"המשך להזמנה"** (`components/PartnerLink.tsx`) → handoff מתויג **ישירות לשותף**. סינון (מחיר/עצירות/שעת יציאה/שעת חזרה/חברה) ומיון ב-`components/FlightResults.tsx`. מצבי loading/empty/error. ✔ אומת חי: marker=742034 בהפניה.
  - **זרימה:** חיפוש → `/flights` (כל הפרטים בעמוד אחד) → "המשך להזמנה" → השותף לקנייה. (עמוד `/flights/detail` בוטל — הפרטים המלאים מוצגים כבר בכרטיס.)
- **חיפוש "לכל מקום" (Everywhere)** (`app/flights/anywhere/`, `searchAnywhere` ב-data.ts): בשדה "לאן" אפשרות נעוצה "כל היעדים" (`ANYWHERE` ב-`LocationInput`, בלי אייקון), **עם או בלי תאריך**. עם תאריך → `prices_for_dates` עם `origin` בלבד; בלי תאריך → `v1/city-directions`. דדופ ליעד (הזול לכל יעד) + מיון מהזול, סינון שבת חל. `searchAnywhere` מחזיר `FlightResult[]` והעמוד מרנדר **רשימת כרטיסי טיסה** (`FlightResults`/`FlightResultCard`, סינון/מיון) — כל כרטיס יעד אחר עם תווית "טיסה ל<יעד>" (שם עברי מ-`places-he` + מפת מטרו) ו-handoff מתויג ישיר לשותף. אומת חי: 24 יעדים ממוינים, marker+locale=he בהפניות. (בעבר: רשת תמונות — הוחלף לבקשת המשתמשת ל"עמוד טיסות רגיל".)
  - **תמונת יעד** בראש עמוד הטיסות (hero): מעדיף את התמונה המאומתת מ-`lib/travel/destinations.ts` (`getDestinationByCode` — אותה תמונה שבדף הבית/עמוד היעד); ליעד שאינו מבין 15 היעדים — fallback ל-`lib/travel/destination-image.ts` (Wikipedia REST, חינם, cache ליום). `next.config.ts` מתיר `upload.wikimedia.org`. ✔ אומת: BUD מציג את תמונת ה-destinations.ts.
  - הערה: השוואת מוכרים מלאה בעמוד שלנו דורשת את Aviasales Flight Search API (נפתח רק ב-50K MAU) — עתידי, לא חסם עסקי.
- **Travelpayouts**: Project + **marker 742034** + **API token** — ב-`.env.local` (מוחרג מ-git). marker גם ב-`NEXT_PUBLIC_TRAVELPAYOUTS_MARKER`.
- `CLAUDE.md` + Skills (`mantur-*`) מכוונים לאפיון `afyun-travel-site-v2-agent.md`. git+GitHub: `ChagitEps/MANTUR`.

## מה כבר נבנה — המשך ✅
- **עמוד תוצאות מלונות** (`app/hotels/`, `components/HotelResultCard.tsx`, `searchHotels` ב-data.ts) — כמו טיסות: תוצאות בעמוד שלנו + "המשך להזמנה" מתויג. בר החיפוש (מלונות) → `/hotels`.
- **סינון שבת (תמיד פעיל, לכולם)**: `lib/travel/shabbat.ts` + `airport-coords.ts` + `@hebcal/core`. `searchFlights` מסננת כל טיסה שממריאה או נוחתת בשבת (הלוך/חזור), לפי זמני הדלקת נרות/צאת שבת מדויקים לכל שדה תעופה (fallback TLV לשדה לא מוכר). גלובלי → משפיע גם על עמודי היעד ותגי המחיר בבית. שורת הבהרה "🕯️ שומר שבת" בעמוד התוצאות. אומת: 11/25 טיסות שבת סוננו נכון TLV↔LCA. (החלטת המשתמשת: תמיד פעיל, לא טוגל.)
- **מדיניות תאריכים: מדויק בלבד (בלי קירוב לחודש).** ה-Data API הוא cache **דליל** — למסלולים פופולריים (LCA/NYC) יש מחיר לתאריך מדויק ומוצג אצלנו; למסלול בלי רשומה (TLV→SKG 10–14.8) **אין קירוב** — מוצג מצב ריק + כפתור "חיפוש טיסות ל<יעד> אצל השותף" עם deep-link מתויג ל**תאריכים המדויקים** (`flightSearchUrl`, פורמט search-code, חיפוש חי אצל Aviasales). חיפוש חי מדויק אצלנו דורש Aviasales Flight Search API (50K MAU). (בעבר היה fallback לחודש — הוסר לבקשת המשתמשת.)
- **חברת תעופה** (`lib/travel/airlines.ts` + `components/FlightBadges.tsx`): לוגו (pics.avs.io) + שם עברי לפי IATA. `GateBadge` — "דרך <אתר>" עם favicon (ניחוש דומיין משם ה-gate).
- **שדרוגי חיפוש**: מוצא ברירת מחדל **TLV (תל אביב)** ב-`SearchBar` (עדיין ניתן לשינוי); `SearchBar` מקבל `initialDestination` (לעמודי יעד). `DateRangeField` — **2 חודשים בדסקטופ**, הדגשת התיבה הפעילה, זרימת "יציאה→ממתין לחזרה" (בלי ברירת מחדל).
- **גילוי נאות אפיליאט** (`components/AffiliateDisclosure.tsx`) — וריאנט `footer` קבוע ב-`app/layout.tsx` (כל עמוד) + `inline` בעמודי טיסות/מלונות/יעד. חובה אתית/רגולטורית (סעיף 8).
- **בלוק "יעדים פופולריים"** בדף הבית (`components/PopularDestinations.tsx`) — כרטיסי תמונה מקושרים לעמודי היעד (SEO), מחבר אותם מדף הבית (סעיף 108). דף הבית עכשיו ISR (revalidate יומי).
- **עמודי יעד (SEO)** (`app/destinations/[slug]/`, `lib/travel/destinations.ts`) — **15 יעדים** (בודפשט/לונדון/רומא/לרנקה/אתונה/פריז/ברצלונה/אמסטרדם/פראג/סלוניקי/בטומי/טביליסי/וינה/מילאנו/סנטוריני), **SSG אינדקסבילי** (title/description עבריים, canonical). כל עמוד: hero תמונת יעד + מדריך (מתי לטוס/מה לעשות) + **טבלת "הטיסות הזולות מתל אביב ל…"** (searchFlights, cache 15 דק') + בר חיפוש מוטמע מכוון ליעד + גילוי נאות. ✔ אומת חי: בודפשט ₪205+.

- **מדידת תנועה אמיתית** (`@vercel/analytics`): `<Analytics/>` ב-`layout` (צפיות/מבקרים) + אירועי משפך מותאמים דרך `lib/analytics/track.ts` — `search` (ב-`SearchBar`) ו-`partner_click` (`components/PartnerLink.tsx` עוטף את כל קישורי ה-handoff: פרטי טיסה, כרטיס מלון, CTA מצב-ריק). נצפה בלוח **Vercel Analytics**. **דורש הפעלת Web Analytics בפרויקט ב-Vercel + redeploy.** אין נתונים מזויפים. לוח בקרה *בתוך* האתר (סעיף 6.10) = שלב עוקב עם Supabase.

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
