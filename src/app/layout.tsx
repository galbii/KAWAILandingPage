import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { WebVitals } from "@/components/WebVitals";
import Script from "next/script";
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/optimized/logos/Kawai-Red.webp',
  },
  openGraph: {
    title: "Piano Sales Houston | KAWAI Piano Deals & Used Pianos | SHSU Event Sept 2025",
    description: "Houston piano sales event featuring KAWAI digital & acoustic pianos. Save up to $6,000 on new & used pianos. Piano deals Houston - SHSU partnership Sept 11-14, 2025. Free delivery!",
    images: [
      {
        url: '/images/optimized/misc/kawai-piano-hands_1200.webp',
        width: 1200,
        height: 630,
        alt: 'KAWAI Piano Sales Event - Premium Piano Collection',
      },
    ],
    type: 'website',
  },
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
        
        {/* Google Ads Conversion Tracking */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=AW-755074614" 
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-755074614');
          `}
        </Script>
        
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '783258114117252');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{display: 'none'}} alt=""
               src="https://www.facebook.com/tr?id=783258114117252&ev=PageView&noscript=1" />
        </noscript>
      </body>
      <GoogleAnalytics gaId="G-P91EKWK0XB" />
    </html>
  );
}
