import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "aimodels.fun — the fun way to keep up with AI models",
    template: "%s · aimodels.fun",
  },
  description:
    "A plain-language, opinionated directory of the AI models that matter — chat, coding, images, video, audio — plus an AI matchmaker that tells you which one fits your project.",
  metadataBase: new URL("https://aimodels.fun"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
