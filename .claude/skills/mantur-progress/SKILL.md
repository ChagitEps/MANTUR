---
name: mantur-progress
description: Current build progress and next steps for the MANTUR project — what is already built, what is still pending, and the ordered MVP roadmap. Use at the start of a MANTUR session, or whenever the user asks "what did we do / where are we / what's next". IMPORTANT: update this file at the end of each build step so it stays accurate.
---

# MANTUR — התקדמות ומצב נוכחי

> קובץ **חי** — לעדכן בסוף כל שלב בנייה כדי שיישאר מדויק.

## מה כבר נבנה ✅
- שלד **Next.js 16** (App Router, Turbopack) + TypeScript strict + **Tailwind v4**, בשורש הפרויקט.
- **RTL + עברית**: `dir="rtl"`, `lang="he"`, פונט Rubik — ב-`app/layout.tsx`.
- מבנה תיקיות: `components/`, `lib/`, `providers/`, `supabase/migrations/`.
- **דף בית ראשוני** (`app/page.tsx`): Header + Hero + בר חיפוש.
  - `components/Header.tsx` — לוגו + ניווט.
  - `components/SearchBar.tsx` — **טוגל חו״ל/בארץ** (בארץ מסתיר טיסות), **לשוניות טיסות/מלונות**, שדות, נגיש + RTL. **החיפוש עדיין לא מחובר** — stub, בלי תוצאות מזויפות.
- `CLAUDE.md` + 5 Skills (`mantur-workflow/database/backend/frontend/security`) מכוונים לאפיון הקנוני `afyun-travel-site-v2-agent.md`.
- **git + GitHub**: `ChagitEps/MANTUR`, ענף `main`.

## מה חסר / חוסם ⏳
- אין עדיין `.env.local` ומפתחות: **Travelpayouts (marker + token)**, Supabase, Anthropic API key.
- בר החיפוש לא יבצע חיפוש עד שתיבנה שכבת ה-Provider ויהיו מפתחות Travelpayouts.

## הרצה
`npm run dev` → http://localhost:3000

## סדר בנייה (MVP — שלב 1 באפיון)
1. ✅ תשתית + דף בית (UI).
2. ⏭️ **שכבת Provider ל-Travelpayouts** (`providers/`) — החוזה שדרכו עוברים טיסות/מלונות. *חוסם: marker + token.*
3. חיבור בר החיפוש → קריאת חיפוש אמיתית.
4. עמוד תוצאות + עמוד פרט + **handoff מתויג**.
5. 3 עמודי יעד (SEO) + גילוי נאות → סוגר שלב 1 ("אתר חי שמייצר הזמנות").

## הצעד הבא
שכבת ה-Provider ל-Travelpayouts (שלב 2 ברשימה). כדי להתחיל אותה צריך את מפתחות ה-Travelpayouts.
