# AGENTS.md - Radio Impacto Digital

<!-- CODEGRAPH_START -->
## CodeGraph

This project has a CodeGraph MCP server (`codegraph_*` tools) configured. CodeGraph is a tree-sitter-parsed knowledge graph of every symbol, edge, and file. Reads are sub-millisecond and return structural information grep cannot.

### When to prefer codegraph over native search

Use codegraph for **structural** questions — what calls what, what would break, where is X defined, what is X's signature. Use native grep/read only for **literal text** queries (string contents, comments, log messages) or after you already have a specific file open.

| Question | Tool |
|---|---|
| "Where is X defined?" / "Find symbol named X" | `codegraph_search` |
| "What calls function Y?" | `codegraph_callers` |
| "What does Y call?" | `codegraph_callees` |
| "What would break if I changed Z?" | `codegraph_impact` |
| "Show me Y's signature / source / docstring" | `codegraph_node` |
| "Give me focused context for a task/area" | `codegraph_context` |
| "Survey an unfamiliar module/topic" | `codegraph_explore` |
| "What files exist under path/" | `codegraph_files` |
| "Is the index healthy?" | `codegraph_status` |

### Rules of thumb

- **Trust codegraph results.** They come from a full AST parse. Do NOT re-verify them with grep
- **Don't grep first** when looking up a symbol by name. `codegraph_search` is faster
- **`codegraph_explore` is the heavy hitter** — returns full source from all relevant files in one call. Spawn an Explore agent for exploration tasks
- **Index lag**: file watcher debounces ~500ms behind writes

### If `.codegraph/` doesn't exist

The MCP server returns "not initialized." Run `codegraph init -i` to build the index.
<!-- CODEGRAPH_END -->

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

## Project Overview

This is a **React 19 + TypeScript + Vite** project with **Tailwind CSS v4**. It's a digital radio station web player with:
- Audio streaming via Zeno.fm with real-time metadata (SSE polling)
- State management with `StreamStatus` enum (Paused, Playing, Loading, Offline)
- PWA support with install prompt
- Social media integration and WhatsApp contact
- Web Share API support
- Privacy policy modal
- Volume persistence via localStorage

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
  App.tsx                    # Main app component with audio streaming
  types.ts                   # TypeScript type definitions (StreamStatus enum)
  components/
    PlayIcon.tsx             # Play button SVG icon
    PauseIcon.tsx            # Pause button SVG icon
    SpinnerIcon.tsx          # Loading spinner SVG icon
    OfflineIcon.tsx          # Offline/disconnected SVG icon
    VolumeIcon.tsx           # Volume control SVG icon
    InstallButton.tsx        # PWA install prompt
    SocialIcons.tsx          # Social media links
    ShareButton.tsx          # Web Share API integration
    PrivacyPolicy.tsx        # Privacy policy modal
public/
  manifest.json              # PWA manifest
```

### GitHub Pages Deployment
- Build output: `dist/` folder
- Homepage URL: https://impactodigitalfm.com/
- Base URL configured via `import.meta.env.BASE_URL`

## Key Features

- **Audio**: Zeno.fm streaming with SSE metadata polling (10s interval)
- **WhatsApp**: Direct contact link `https://wa.me/584267793042`
- **Privacy**: Modal triggered via `#privacy` hash or button
- **Volume**: Persisted in localStorage under `radio-volume`
