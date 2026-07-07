import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BotVill — give your website a helpful little robot",
  description:
    "Build a custom AI chatbot in minutes: paste your knowledge, pick a personality, and embed it on any website with one script tag.",
  metadataBase: new URL("https://botvill.com"),
  openGraph: {
    title: "BotVill",
    description: "Give your website a helpful little robot.",
    url: "https://botvill.com",
    siteName: "BotVill",
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
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
