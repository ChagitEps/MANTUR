/**
 * מזריק JSON-LD (schema.org) בבטחה כ-<script type="application/ld+json">.
 * מחליף "<" כדי למנוע סגירת סקריפט/XSS. Server Component.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
