import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BiblePeer — study scripture together",
  description:
    "Study circles for reading the Bible with friends, guided reading plans with streaks, and a thoughtful AI study companion.",
  metadataBase: new URL("https://biblepeer.com"),
  openGraph: {
    title: "BiblePeer",
    description: "Study scripture together — circles, reading plans, and a study companion.",
    url: "https://biblepeer.com",
    siteName: "BiblePeer",
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
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
