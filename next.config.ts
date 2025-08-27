import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Compress responses
  compress: true,
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                https://assets.calendly.com 
                https://static.ctctcdn.com 
                https://cdnjs.cloudflare.com
                https://www.google.com
                https://www.gstatic.com
                https://www.googletagmanager.com 
                https://tagmanager.google.com 
                https://tagassistant.google.com
                https://connect.facebook.net 
                https://business.facebook.com
                https://www.facebook.com
                https://www.google-analytics.com 
                https://ssl.google-analytics.com 
                https://static.xx.fbcdn.net 
                https://googleads.g.doubleclick.net 
                https://www.googleadservices.com
                https://us.posthog.com 
                https://app.posthog.com 
                https://us.i.posthog.com 
                https://us-assets.i.posthog.com;
              connect-src 'self' 
                https://api.calendly.com 
                https://calendly.com 
                https://us.posthog.com 
                https://internal-j.posthog.com 
                https://us-assets.i.posthog.com 
                https://us.i.posthog.com 
                https://static.ctctcdn.com 
                https://visitor.constantcontact.com 
                https://www.google-analytics.com 
                https://www.google.com
                https://www.gstatic.com
                https://recaptcha.google.com
                https://tagmanager.google.com 
                https://tagassistant.google.com
                https://stats.g.doubleclick.net 
                https://graph.facebook.com 
                https://connect.facebook.net 
                https://business.facebook.com
                https://www.facebook.com
                https://googleads.g.doubleclick.net 
                https://www.googleadservices.com;
              img-src 'self' data: blob: 
                https://www.google-analytics.com 
                https://stats.g.doubleclick.net 
                https://www.facebook.com 
                https://static.xx.fbcdn.net 
                https://googleads.g.doubleclick.net 
                https://www.googleadservices.com
                https://www.google.com
                https://www.gstatic.com;
              frame-src 'self' 
                https://calendly.com 
                https://assets.calendly.com 
                https://www.google.com 
                https://maps.google.com 
                https://www.googletagmanager.com
                https://tagmanager.google.com 
                https://tagassistant.google.com
                https://recaptcha.google.com
                https://static.ctctcdn.com 
                https://visitor.constantcontact.com
                https://us.posthog.com 
                https://app.posthog.com 
                https://us.i.posthog.com 
                https://us-assets.i.posthog.com
                https://business.facebook.com
                https://www.facebook.com;
              style-src 'self' 'unsafe-inline';
              font-src 'self' data:;
              object-src 'none';
              base-uri 'self';
              form-action 'self' https://visitor.constantcontact.com;
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
      {
        // Cache static assets
        source: '/((?!_next/image)(?!_next/static)(?!api/)(?!videos/).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images and videos more aggressively
        source: '/(.*)\.(jpg|jpeg|png|gif|ico|svg|webp|mp4|webm)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Preload key resources
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</videos/CA.mp4>; rel=preload; as=video; type="video/mp4"',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
