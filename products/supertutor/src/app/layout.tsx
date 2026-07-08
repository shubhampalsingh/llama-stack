import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "SuperTutor — your fun AI tutor",
  description:
    "Learn anything with SuperTutor: a friendly AI tutor that guides you step by step, generates quizzes, solves photo problems, and builds flashcards. Free to try!",
  metadataBase: new URL("https://supertutor.fun"),
  openGraph: {
    title: "SuperTutor — your fun AI tutor",
    description:
      "Chat with a friendly AI tutor, snap homework photos, take quizzes and master flashcards.",
    url: "https://supertutor.fun",
    siteName: "SuperTutor",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${baloo.variable} ${nunito.variable} blob-bg min-h-screen antialiased`}
      >
        <Nav />
        <main className="mx-auto max-w-5xl px-4 pb-16">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-8 text-center text-sm text-ink/50">
          <span className="display">SuperTutor</span> · supertutor.fun · learning
          made fun 🎉
        </footer>
      </body>
    </html>
  );
}
