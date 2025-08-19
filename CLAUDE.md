# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `bun dev` - Starts Next.js development server on http://localhost:3000
- **Build**: `bun build` - Creates production build
- **Start production**: `bun start` - Runs production server
- **Lint**: `bun lint` - Runs ESLint with Next.js configuration

## Project Architecture

This is a **Next.js 15 application** using the App Router with the following structure:

### Technology Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Styling**: Tailwind CSS v4 with PostCSS
- **Typography**: Geist font family (Sans & Mono) via `next/font/google`
- **Language**: TypeScript with strict configuration
- **Linting**: ESLint with Next.js TypeScript configuration

### Key Architecture Patterns
- **App Router Structure**: Uses `src/app/` directory with `layout.tsx` and `page.tsx` convention
- **Font Optimization**: Utilizes Next.js font optimization with CSS variables for Geist fonts
- **Styling Approach**: Tailwind CSS with custom CSS variables in `globals.css` for theming
- **Dark Mode**: Automatic dark mode support via `prefers-color-scheme` media query
- **Path Aliases**: TypeScript path mapping configured for `@/*` pointing to `./src/*`

### File Structure
- `src/app/layout.tsx` - Root layout with font configuration and metadata
- `src/app/page.tsx` - Main landing page component
- `src/app/globals.css` - Global styles with Tailwind imports and CSS custom properties
- `public/` - Static assets (SVG icons for Next.js, Vercel, etc.)

### Styling System
- Uses Tailwind's inline theme configuration in `globals.css`
- CSS custom properties for background/foreground colors with dark mode variants
- Responsive design patterns with `sm:` breakpoints throughout components
- use nextjs app router