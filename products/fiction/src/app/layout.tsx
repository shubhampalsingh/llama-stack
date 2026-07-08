import type { Metadata } from "next";
import { Fraunces, Crimson_Pro, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const crimson = Crimson_Pro({ subsets: ["latin"], variable: "--font-crimson" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "fiction.diy — build your own story",
  description:
    "Play AI-powered choose-your-own-adventure stories where anything you type can happen, or write your own fiction with an AI co-author. Free to play.",
  metadataBase: new URL("https://fiction.diy"),
  openGraph: {
    title: "fiction.diy — build your own story",
    description:
      "Choose-your-own-adventure stories where anything can happen, plus an AI co-author for your own fiction.",
    url: "https://fiction.diy",
    siteName: "fiction.diy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${crimson.variable} ${nunito.variable} min-h-screen antialiased`}
      >
        <Nav />
        <main className="mx-auto max-w-4xl px-4 pb-20">{children}</main>
        <footer className="mx-auto max-w-4xl px-4 pb-8 text-center text-sm text-faded/60">
          <span className="display">fiction.diy</span> · every story is yours 🕯️
        </footer>
      </body>
    </html>
  );
}
