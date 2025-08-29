import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { WebVitals } from "@/components/WebVitals";
import { PostHogProvider } from "@/components/PostHogProvider";
import PostHogDebugDashboard from "@/components/PostHogDebugDashboard";
import CalendlyPreloader from "@/components/CalendlyPreloader";
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
      <head>
        {/* Viewport for mobile Calendly support - per official docs */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Calendly Performance Optimizations */}
        {/* DNS prefetch for Calendly domains */}
        <link rel="dns-prefetch" href="https://calendly.com" />
        <link rel="dns-prefetch" href="https://assets.calendly.com" />
        
        {/* Preconnect to Calendly with crossorigin for faster requests */}
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="preconnect" href="https://calendly.com" />
        
        {/* Preload critical Calendly resources */}
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="preload" as="style" />
        <link href="https://assets.calendly.com/assets/external/widget.js" rel="preload" as="script" />
        
        {/* Load Calendly CSS immediately for faster rendering */}
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
        
        {/* Google ReCAPTCHA Resources for Calendly */}
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com/recaptcha/" />
        <link rel="dns-prefetch" href="https://www.gstatic.com/recaptcha/" />
        
        {/* Google tag (gtag.js) */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-P91EKWK0XB" 
          strategy="afterInteractive" 
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P91EKWK0XB');
          `}
        </Script>
        
        {/* Meta Pixel Code */}
        <script dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '783258114117252');
fbq('track', 'PageView');`
        }} />
        <noscript dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=783258114117252&ev=PageView&noscript=1"
/>`
        }} />
        {/* End Meta Pixel Code */}
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased overflow-x-hidden`}
      >
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <PostHogDebugDashboard />
        <WebVitals />
        <CalendlyPreloader />
        
        {/* Calendly JavaScript Loading */}
        <Script 
          src="https://assets.calendly.com/assets/external/widget.js" 
          strategy="afterInteractive"
        />
        
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
        
        <GoogleAnalytics gaId="G-P91EKWK0XB" />
      </body>
    </html>
  );
}
