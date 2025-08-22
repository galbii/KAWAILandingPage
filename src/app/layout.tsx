import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { WebVitals } from "@/components/WebVitals";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Piano Sales Houston | KAWAI Piano Deals & Used Pianos | SHSU Event Sept 2025",
  description: "Houston piano sales event featuring KAWAI digital & acoustic pianos. Save up to $6,000 on new & used pianos. Piano deals Houston - SHSU partnership Sept 11-14, 2025. Free delivery!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
      >
        {children}
        <WebVitals />
      </body>
      <GoogleAnalytics gaId="G-P91EKWK0XB" />
    </html>
  );
}
