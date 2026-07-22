import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { DESTINATIONS } from "@/lib/travel/destinations";

/** sitemap.xml — עמודי תוכן אינדקסביליים (בית, יעדים, סטטיים). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const destEntries: MetadataRoute.Sitemap = DESTINATIONS.map((d) => ({
    url: `${SITE.url}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...destEntries];
}
