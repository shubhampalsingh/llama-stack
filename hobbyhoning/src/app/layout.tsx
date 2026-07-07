import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HobbyHoning — hone your craft, one session at a time",
  description:
    "Pick a hobby, get an AI-crafted learning path, log your practice, and level up from Dabbler to Grandmaster.",
  metadataBase: new URL("https://hobbyhoning.com"),
  openGraph: {
    title: "HobbyHoning",
    description: "Hone your craft, one session at a time.",
    url: "https://hobbyhoning.com",
    siteName: "HobbyHoning",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=IBM+Plex+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
