---
name: mantur-database
description: Supabase/Postgres schema conventions for the MANTUR travel platform. Use when designing or modifying the database — creating tables, columns, relations, migrations, indexes, RLS policies, or storage buckets, or when deciding how data is stored. Enforces the "never store flight/hotel prices as source of truth" rule and RLS-by-default.
---

# MANTUR — Database (Supabase / Postgres)

מקור אמת עליון לנתונים. בעת סתירה עם קוד — ה-DB קובע (ראה `mantur-workflow`).

## מוסכמות טבלה
- שמות טבלאות: `snake_case` ברבים (`users`, `price_alerts`, `travel_requests`).
- כל טבלה: `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at timestamptz default now()` (trigger לעדכון).
- מפתחות זרים: `<entity>_id` עם `references … on delete` מפורש.
- **Soft-delete**: `deleted_at timestamptz` על ישויות משתמש. אין מחיקה קשה של משתמשים דרך ה-UI — סימון בלבד, ושמירה לפי מדיניות שמירת המידע.

## מה לא שומרים (קריטי — עקרון כנות המחיר, סעיפים 4/9 באפיון)
- **מחירי טיסות/מלונות, זמינות ותוצאות חיפוש אינם נשמרים כמקור אמת.**
- מותר cache זמני לביצועים בלבד: טבלה/שכבת cache עם `fetched_at` ו-`ttl`/`expires_at`, ולעולם לא להציג נתון שפג-תוקף כאילו הוא עדכני. המחיר הקובע הוא זה שהתקבל מהספק בזמן החיפוש.

## נתונים פנימיים (כן נשמרים)
`users`, `favorites`, `price_alerts`, `travel_requests`, `blog_posts`, `pages`, `settings`, `analytics_events`, `affiliate_stats`, `logs`, `deals` (ידניים + מטמון של אוטומטיים).

## RLS — חובה
- **RLS ON לכל טבלה עם נתוני משתמש.** deny-by-default; policies מפורשות פר-role.
- Roles: `visitor` (ללא חשבון), `user`, `agent`, `admin`.
- משתמש רגיל רואה/עורך רק את הרשומות שלו (`auth.uid() = user_id`). `agent` ניגש לפניות (`travel_requests`). `admin` — גישה מלאה דרך policies ייעודיות.
- לעולם לא לסמוך על סינון בצד הלקוח או ב-application layer בלבד — ה-RLS הוא קו ההגנה האחרון.

## Migrations
- ב-`supabase/migrations/`, forward-only, אטומיות, עם שם תיאורי (`<timestamp>_add_price_alerts.sql`).
- כל שינוי סכמה = migration. אין שינויים ידניים ב-DB בלי migration.

## Indexes
- אינדקס על כל FK ועל עמודות שמשמשות לחיפוש/מיון (`created_at`, `status`, `user_id`, `deleted_at`).

## Storage
- Buckets נפרדים (למשל `avatars`, `blog-images`, `deal-images`) עם storage policies מתאימות (קריאה ציבורית לתמונות תוכן; כתיבה לפי הרשאה).

## מצב דתי/כשר (פיצ'ר opt-in) — שכבות נתונים
- **טבלת אוצרות ידנית** (למשל `kosher_hotels`) לתכונות שאינן בפיד ה-OTA: כשרות/רמת השגחה, שומר-שבת, מעלית שבת, מרחק הליכה לבי"כ/חב"ד, מקווה בקרבת מקום. זהו מקור אמת פנימי שמתוחזק ידנית — עם `verified_at` ושדה מקור, כי הסטטוס משתנה.
- **POI (בתי כנסת/חב"ד/מקווה/מסעדות כשרות)** נשלפים דרך שכבת `providers/` (Google Places), עם cache. **לא לגרד את Chabad.org** — רק API מורשה.
- **לוח עברי** (זמני שבת/חג) דרך HebCal — cache פר-יעד/תאריך.
- **בחירת ה-opt-in של המשתמש נשמרת** בהעדפות (`users`/`user_preferences`) כדי שלא ידליק בכל ביקור.

מקור האמת למוצר הוא `afyun-travel-site-v2-agent.md`; Skill זה מספק את מוסכמות ה-DB שאינן מפורטות באפיון.
