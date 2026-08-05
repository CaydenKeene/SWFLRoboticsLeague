import type { Metadata } from "next";
import { Archivo_Black, Barlow } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  // Resolves link-preview URLs against the live domain instead of localhost.
  metadataBase: new URL(site.url),
  title: `${site.name} | FIRST Tech Challenge`,
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
