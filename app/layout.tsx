import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "MANTUR — מנוע נסיעות ישראלי",
  description:
    "מצאו לאן הכי שווה לברוח — בארץ או בעולם. חיפוש טיסות ומלונות בעברית.",
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
        <AffiliateDisclosure variant="footer" />
        <Analytics />
      </body>
    </html>
  );
}
