import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppVill — the app development studio",
  description:
    "AppVill is an app development studio building mobile apps, web apps, games, and AI products — from idea to launched, fast.",
  metadataBase: new URL("https://appvill.com"),
  openGraph: {
    title: "AppVill",
    description: "We build apps. All of them. Mobile, web, games, AI.",
    url: "https://appvill.com",
    siteName: "AppVill",
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
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,600;0,800;0,900;1,400&family=IBM+Plex+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
