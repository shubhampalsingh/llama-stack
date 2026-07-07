import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YappCode — yap it into an app",
  description:
    "Describe what you want in plain English and watch it become a real, working mini-app. No code. Just yapping.",
  metadataBase: new URL("https://yappcode.com"),
  openGraph: {
    title: "YappCode",
    description: "Yap it into an app. Build real mini-apps by talking.",
    url: "https://yappcode.com",
    siteName: "YappCode",
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
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&family=IBM+Plex+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
