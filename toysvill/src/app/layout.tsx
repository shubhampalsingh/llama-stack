import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "ToysVill — the village toy shop",
  description:
    "Classic wooden toys, puzzles, plushies and little-learner sets. Timeless toys, built to be handed down.",
  metadataBase: new URL("https://toysvill.com"),
  openGraph: {
    title: "ToysVill",
    description: "The village toy shop — classic wooden toys built to be handed down.",
    url: "https://toysvill.com",
    siteName: "ToysVill",
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
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
