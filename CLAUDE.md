# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
npm run deploy   # Build and deploy to GitHub Pages (gh-pages branch)
```

## Architecture

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4

**Entry point:** `index.tsx` renders `<App />` into `#root`

**Core functionality:** Single-page radio streaming app with:
- Live audio stream from Zeno.fm (`STREAM_URL` in App.tsx)
- Polling metadata API for "now playing" info (10s interval)
- PWA with offline support (service worker in `public/sw.js`)
- Volume control persisted to localStorage
- Platform-aware social media deep linking (iOS/Android)

**Key components:**
- `App.tsx` - Main player component with audio state machine (Playing/Loading/Paused/Offline)
- `InstallButton.tsx` - PWA install prompt using `beforeinstallprompt` event
- `SocialIcons.tsx` - Deep links for Facebook/Instagram/YouTube + APK download + share
- `ShareButton.tsx` - Web Share API with fallback menu
- `PrivacyPolicy.tsx` - Modal dialog

**Path aliases:** `@/*` → `./*`, `@components/*` → `src/components/*`

**Deploy:** GitHub Pages via `gh-pages` package (see `vite.config.ts` for base path config)
