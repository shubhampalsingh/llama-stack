import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "SuperSchool — lesson plans, courses & worksheets in seconds",
  description:
    "AI teaching assistant for teachers and homeschooling parents: complete lesson plans, multi-week courses, printable worksheets with answer keys, and balanced homeschool weeks.",
  metadataBase: new URL("https://superschool.fun"),
  openGraph: {
    title: "SuperSchool — teaching materials in seconds",
    description:
      "Lesson plans, courses, printable worksheets and homeschool weeks — generated in 30 seconds, ready to teach.",
    url: "https://superschool.fun",
    siteName: "SuperSchool",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${nunito.variable} min-h-screen antialiased`}>
        <Nav />
        <main className="mx-auto max-w-5xl px-4 pb-16">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-8 text-center text-sm text-ink/50">
          <span className="display">SuperSchool</span> · superschool.fun · made
          with 🍎 for teachers & parents · sister of{" "}
          <a href="https://supertutor.fun" className="font-bold text-indigo underline">
            supertutor.fun
          </a>
        </footer>
      </body>
    </html>
  );
}
