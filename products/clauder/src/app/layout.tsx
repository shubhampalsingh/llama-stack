import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { NewsletterFooter } from "@/components/Newsletter";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Clauder Club — the clubhouse for Claude power users",
  description:
    "A curated prompt library, agent recipes, and the Prompt Doctor — get dramatically more out of Claude. Free to join.",
  metadataBase: new URL("https://clauder.club"),
  openGraph: {
    title: "Clauder Club",
    description:
      "Curated prompts, agent recipes, and the Prompt Doctor for Claude power users.",
    url: "https://clauder.club",
    siteName: "Clauder Club",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${instrument.variable} min-h-screen antialiased`}>
        <Nav />
        <main className="mx-auto max-w-5xl px-4 pb-20">{children}</main>
        <NewsletterFooter />
      </body>
    </html>
  );
}
