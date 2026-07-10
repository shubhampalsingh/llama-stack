import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });

export const metadata: Metadata = {
  title: "Alohomora Club — the network that opens doors",
  description:
    "A private, vetted club for business and startup people. Post the door you're stuck behind; a member who holds the key opens it. Founding cohort now accepting applications.",
  metadataBase: new URL("https://alohomora.club"),
  openGraph: {
    title: "Alohomora Club",
    description:
      "The private network that opens doors. Vetted members, warm intros, real unlocks.",
    url: "https://alohomora.club",
    siteName: "Alohomora Club",
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
        <footer className="border-t border-line">
          <div className="mx-auto max-w-5xl px-4 py-8 text-center text-sm text-muted">
            <span className="display gold-text">Alohomora Club</span> · the network that
            opens doors · <span className="animate-key">🗝️</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
