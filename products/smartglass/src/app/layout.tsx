import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { NewsletterFooter } from "@/components/Newsletter";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });

export const metadata: Metadata = {
  title: "smartglass.games — gaming on smart glasses, figured out",
  description:
    "The hub for gaming on AR display glasses: honest rankings of XREAL, Viture, RayNeo and Rokid, plus setup guides for Steam Deck, Switch, and cloud gaming rigs.",
  metadataBase: new URL("https://smartglass.games"),
  openGraph: {
    title: "smartglass.games",
    description:
      "Honest rankings and setup guides for gaming on smart glasses — Steam Deck, Switch 2, cloud rigs and more.",
    url: "https://smartglass.games",
    siteName: "smartglass.games",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${grotesk.variable} ${instrument.variable} min-h-screen antialiased`}>
        <nav className="sticky top-0 z-20 border-b border-line bg-abyss/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 text-sm font-semibold">
            <Link href="/" className="display mr-3 text-lg font-bold">
              🕶️ <span className="gradient-text">smartglass</span>.games
            </Link>
            <Link href="/glasses" className="rounded-full px-3 py-1.5 text-dim hover:bg-white/5 hover:text-frost">
              Rankings
            </Link>
            <Link href="/guides" className="rounded-full px-3 py-1.5 text-dim hover:bg-white/5 hover:text-frost">
              Guides
            </Link>
            <a href="#newsletter" className="btn ml-auto px-4 py-1.5 text-xs">
              Get the drop
            </a>
          </div>
        </nav>
        <main className="mx-auto max-w-5xl px-4 pb-20">{children}</main>
        <NewsletterFooter />
      </body>
    </html>
  );
}
