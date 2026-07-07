import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StartupVill — the village where startups launch",
  description:
    "Launch your startup at the weekly market, collect upvotes from fellow villagers, and take your place in the village directory.",
  metadataBase: new URL("https://startupvill.com"),
  openGraph: {
    title: "StartupVill",
    description: "The village where startups launch. New market every week.",
    url: "https://startupvill.com",
    siteName: "StartupVill",
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
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;0,9..144,900;1,9..144,500&family=IBM+Plex+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
