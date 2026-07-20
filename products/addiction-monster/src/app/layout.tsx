import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Addiction Monster — starve the thing that feeds on you",
    template: "%s · Addiction Monster",
  },
  description:
    "Your addiction is a monster. Every clean day starves it smaller. Streaks, money saved, daily check-ins, and a Craving SOS chat for the hard minutes. Not therapy — a companion.",
  metadataBase: new URL("https://addiction.monster"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
