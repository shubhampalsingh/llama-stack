import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeadLimit — deadlines with teeth",
  description:
    "Set a deadline. Face the countdown. Escalating reminders, public witnesses, and money on the line. Miss it, and it goes in the graveyard.",
  metadataBase: new URL("https://deadlimit.com"),
  openGraph: {
    title: "DeadLimit",
    description: "Deadlines with teeth. The Reaper is watching.",
    url: "https://deadlimit.com",
    siteName: "DeadLimit",
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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500&family=IBM+Plex+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="fog min-h-full flex flex-col">{children}</body>
    </html>
  );
}
