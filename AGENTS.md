# AGENTS.md - Radio Impacto Digital

## Build Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run predeploy && npm run deploy
```

**Note:** Requires `GEMINI_API_KEY` in `.env.local` for full functionality.

## Project Overview

This is a React 19 + TypeScript + Vite project with Tailwind CSS v4. It's a digital radio station web player with:
- Audio streaming with primary/backup URLs
- Real-time metadata fetching
- PWA support (install button)
- Social media integration
- Web Share API support

## Code Style Guidelines

### TypeScript
- Use explicit TypeScript types; avoid `any`
- Use interfaces for object shapes, types for unions/primitives
- Component props should use `React.FC<Props>` or typed function components
- Enums for state machines (see `StreamStatus` in `types.ts`)

### React Components
- Use functional components with hooks
- Prefer `useCallback` for event handlers and callbacks passed to children
- Use `useEffect` with proper cleanup (return cleanup function)
- Use proper TypeScript generics where needed
- Default to named exports for components

### Imports
```typescript
// React core imports
import React, { useState, useEffect, useCallback, useRef } from "react";

// Absolute imports using path aliases
import { StreamStatus } from "../types";
import { PlayIcon } from "./components/PlayIcon";

// Relative imports for sibling files
import { SocialIcons } from "./components/SocialIcons";
```

### Naming Conventions
- **Components**: PascalCase (`PlayIcon`, `ShareButton`)
- **Files**: camelCase for utilities, PascalCase for components (`.tsx`)
- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE for config values
- **Types/Enums**: PascalCase
- **CSS classes**: kebab-case (Tailwind)

### Error Handling
- Wrap async operations in try/catch blocks
- Log errors with `console.error` including context
- Set fallback/default state on error (e.g., `setNowPlaying("Radio Impacto Digital")`)
- Handle promise rejections from `.play()` and `.fetch()` calls

### Tailwind CSS
- Use utility classes directly in JSX
- Common pattern: `className="w-10 h-10 text-amber-400"`
- Use `bg-gray-900`, `text-white`, `accent-amber-400` per theme
- Responsive prefixes: `md:w-80`, `md:h-44`
- State variants: `hover:bg-green-600`, `active:scale-95`

### Accessibility
- Include `aria-label` on interactive elements
- Use `role="status"` and `aria-live="polite"` for dynamic content
- Provide `alt` text for images
- Use semantic HTML (`<nav>`, `<main>`, `<header>`, `<footer>`)

### Event Handling
- Type React events: `React.ChangeEvent<HTMLInputElement>`
- Use `useCallback` for handlers passed to components
- Prevent default for anchor buttons: `e.preventDefault()`

### Audio/Web APIs
- Use `useRef` for Audio element: `useRef<HTMLAudioElement | null>(null)`
- Handle browser restrictions on autoplay
- Implement fallback stream logic with `isUsingBackupRef`
- Use `crossOrigin = "anonymous"` for audio elements

### File Structure
```
src/
  App.tsx                    # Main app component
  components/
    ShareButton.tsx          # Share menu component
    SocialIcons.tsx          # Social media links
    InstallButton.tsx        # PWA install prompt
    *Icon.tsx                # SVG icon components
  types.ts                   # TypeScript type definitions
types.ts                     # Root types (StreamStatus enum)
```

### GitHub Pages Deployment
- Build output: `dist/` folder
- Homepage URL: https://moralex74ve.github.io/radio-impacto/
- Base URL configured via `import.meta.env.BASE_URL`
