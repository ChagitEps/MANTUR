import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

const DESCRIPTION =
  "מצאו לאן הכי שווה לברוח — בארץ או בעולם. חיפוש טיסות ומלונות בעברית.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} — ${SITE.tagline}`,
  description: DESCRIPTION,
  applicationName: SITE.name,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: DESCRIPTION,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
