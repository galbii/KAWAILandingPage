# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Next.js development server on http://localhost:3000
- **Build**: `npm run build` - Creates production build
- **Start production**: `npm start` - Runs production server
- **Lint**: `npm run lint` - Runs ESLint with Next.js configuration

## Project Architecture

This is a **Next.js 15.4.6 application** using the App Router with the following structure:

### Technology Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Styling**: Tailwind CSS v4 with PostCSS plugin
- **UI Components**: Custom UI system with shadcn/ui components (Badge, Button, Card)
- **Typography**: Geist font family (Sans & Mono) via `next/font/google`
- **Language**: TypeScript with strict configuration
- **Linting**: ESLint with Next.js TypeScript configuration
- **Icons**: Lucide React icon library
- **Utilities**: clsx and tailwind-merge for conditional styling

### Key Architecture Patterns
- **App Router Structure**: Uses `src/app/` directory with `layout.tsx` and `page.tsx` convention
- **Component Organization**: Structured with `components/sections/` for page sections and `components/ui/` for reusable UI components
- **Font Optimization**: Utilizes Next.js font optimization with CSS variables for Geist fonts
- **Styling Approach**: Advanced Tailwind CSS setup with custom CSS variables, gradients, animations, and scroll effects
- **Data Layer**: Centralized data management in `src/data/` directory for pianos and testimonials
- **Custom Hooks**: React hooks for functionality like scroll animations (`useScrollAnimations.ts`)
- **Path Aliases**: TypeScript path mapping configured for `@/*` pointing to `./src/*`

### File Structure
- `src/app/layout.tsx` - Root layout with font configuration and metadata
- `src/app/page.tsx` - Main landing page component
- `src/app/globals.css` - Comprehensive global styles with custom CSS properties, animations, and utility classes
- `src/components/Header.tsx` - Main navigation component
- `src/components/sections/` - Page section components (Hero, About, Contact, etc.)
- `src/components/ui/` - Reusable UI components following shadcn/ui patterns
- `src/data/` - Static data files for content management
- `src/hooks/` - Custom React hooks
- `src/lib/utils.ts` - Utility functions using clsx and tailwind-merge
- `public/` - Static assets including images and videos

### Styling System
- **CSS Custom Properties**: Extensive use of CSS variables for colors, gradients, shadows, and spacing
- **Premium Design System**: Custom KAWAI and TSU brand colors with sophisticated gradients
- **Advanced Animations**: Custom keyframes for fadeIn, slide, scale, shimmer, and parallax effects
- **Scroll-Based Interactions**: Header state management and scroll-triggered animations
- **Component-Specific Classes**: Specialized styling for cards, buttons, and interactive elements
- **Responsive Design**: Mobile-first approach with `sm:`, `lg:` breakpoints
- **Performance Optimizations**: GPU acceleration and backface-visibility optimizations

### shadcn/ui Integration
- **Configuration**: `components.json` configured with "new-york" style, RSC enabled
- **Components**: Badge, Button, Card components implemented
- **Styling**: Neutral base color with CSS variables enabled
- **Icons**: Lucide React integration

### Business Context
This is a landing page for a **KAWAI piano sale event** in partnership with **Texas Southern University**, featuring:
- Event dates: April 3-6, 2025 in Houston
- Premium piano showcase and consultation booking
- Brand partnership between KAWAI and TSU
- Sophisticated, premium-focused design aesthetic