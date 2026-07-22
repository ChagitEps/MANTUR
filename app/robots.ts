import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** robots.txt — לאינדוקס עמודי תוכן; עמודי חיפוש דינמיים חסומים מסריקה. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/flights", "/hotels", "/api/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
