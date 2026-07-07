import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Commander — Multi-agent mission control",
  description:
    "Define AI agents, assign them missions, and watch them execute in real time. Bring your own Anthropic API key.",
  metadataBase: new URL("https://aicommander.com"),
  openGraph: {
    title: "AI Commander",
    description: "Multi-agent mission control. Command your AI workforce.",
    url: "https://aicommander.com",
    siteName: "AI Commander",
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
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col scanlines">{children}</body>
    </html>
  );
}
