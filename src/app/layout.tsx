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
  title: "KAWAI Piano Sale | SHSU Partnership | September 11-14, 2025 | Houston",
  description: "Exclusive KAWAI piano sale in partnership with Sam Houston State University. Save up to $6,000 on premium pianos. Book your private consultation for September 11-14, 2025 in Houston.",
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
