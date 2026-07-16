# Graph Report - .  (2026-06-05)

## Corpus Check
- Corpus is ~17,839 words - fits in a single context window. You may not need a graph.

## Summary
- 162 nodes · 176 edges · 19 communities (11 shown, 8 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.91)
- Token cost: 2,800 input · 3,800 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Radio Station Core Config|Radio Station Core Config]]
- [[_COMMUNITY_UI Icon Components|UI Icon Components]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_PWA Manifest Settings|PWA Manifest Settings]]
- [[_COMMUNITY_NPM Build Scripts|NPM Build Scripts]]
- [[_COMMUNITY_PWA Install Ecosystem|PWA Install Ecosystem]]
- [[_COMMUNITY_Social & Share Components|Social & Share Components]]
- [[_COMMUNITY_OpenCode Metadata|OpenCode Metadata]]
- [[_COMMUNITY_Graphify Tooling|Graphify Tooling]]
- [[_COMMUNITY_React Entry Point|React Entry Point]]
- [[_COMMUNITY_OpenCode Permissions|OpenCode Permissions]]
- [[_COMMUNITY_OpenCode Plugin Config|OpenCode Plugin Config]]
- [[_COMMUNITY_OpenCode Plugin Deps|OpenCode Plugin Deps]]
- [[_COMMUNITY_Service Worker|Service Worker]]
- [[_COMMUNITY_CodeGraph MCP|CodeGraph MCP]]
- [[_COMMUNITY_Privacy Policy Component|Privacy Policy Component]]

## God Nodes (most connected - your core abstractions)
1. `Radio Impacto Digital` - 29 edges
2. `compilerOptions` - 17 edges
3. `scripts` - 10 edges
4. `PWA Support` - 7 edges
5. `InstallButton()` - 3 edges
6. `OfflineIcon()` - 3 edges
7. `PauseIcon()` - 3 edges
8. `PlayIcon()` - 3 edges
9. `PrivacyPolicy()` - 3 edges
10. `ShareButton()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Imgur Banner Image` --promotional_image_for--> `Radio Impacto Digital`  [INFERRED]
  public/Imgur.webp → AGENTS.md
- `Favicon 16x16` --browser_icon_for--> `Radio Impacto Digital`  [EXTRACTED]
  public/favicon-16x16.png → AGENTS.md
- `Favicon 32x32` --browser_icon_for--> `Radio Impacto Digital`  [EXTRACTED]
  public/favicon-32x32.png → AGENTS.md
- `Radio Impacto Digital Logo` --represents_brand_of--> `Radio Impacto Digital`  [EXTRACTED]
  public/Logo.svg → AGENTS.md
- `Open Graph Social Preview Image` --social_preview_for--> `Radio Impacto Digital`  [EXTRACTED]
  public/og-image.webp → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Knowledge Graph Workflow** — command_graphify_graphify_pipeline, command_graphify_export_graphify_export, command_graphify_query_graphify_query [EXTRACTED 1.00]
- **PWA Ecosystem** — index_service_worker, claude_installbutton, index_pwa_meta_tags, agents_pwa_support [INFERRED 0.85]
- **Social Web Presence** — index_instagram, index_youtube, claude_socialicons, vivo_youtube_live_redirect, youtube_youtube_channel_redirect [INFERRED 0.85]

## Communities (19 total, 8 thin omitted)

### Community 0 - "Radio Station Core Config"
Cohesion: 0.06
Nodes (34): GitHub Pages Deployment, npm run build, npm run deploy, npm run dev, Radio Impacto Digital, SSE Polling, StreamStatus, Volume Persistence (+26 more)

### Community 1 - "UI Icon Components"
Cohesion: 0.13
Nodes (15): BeforeInstallPromptEvent, InstallButton(), IconProps, OfflineIcon(), IconProps, PauseIcon(), IconProps, PlayIcon() (+7 more)

### Community 2 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, baseUrl, experimentalDecorators, isolatedModules, jsx, lib (+11 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, @google/genai, react, react-dom, tailwindcss, @tailwindcss/vite, devDependencies, gh-pages (+10 more)

### Community 4 - "PWA Manifest Settings"
Cohesion: 0.17
Nodes (11): background_color, description, display, icons, name, orientation, prefer_related_applications, scope (+3 more)

### Community 5 - "NPM Build Scripts"
Cohesion: 0.20
Nodes (10): scripts, build, cg:index, cg:init, cg:status, cg:sync, deploy, dev (+2 more)

### Community 6 - "PWA Install Ecosystem"
Cohesion: 0.29
Nodes (7): PWA Support, InstallButton, PWA Meta Tags, Service Worker, Apple Touch Icon, PWA Icon 192x192, PWA Icon 512x512

### Community 8 - "OpenCode Metadata"
Cohesion: 0.50
Nodes (3): description, name, requestFramePermissions

### Community 9 - "Graphify Tooling"
Cohesion: 0.67
Nodes (3): Graphify Export, Graphify Pipeline, Graphify Query

## Knowledge Gaps
- **104 isolated node(s):** `allow`, `$schema`, `plugin`, `@opencode-ai/plugin`, `rootElement` (+99 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Radio Impacto Digital` connect `Radio Station Core Config` to `PWA Install Ecosystem`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `PWA Support` connect `PWA Install Ecosystem` to `Radio Station Core Config`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `scripts` connect `NPM Build Scripts` to `NPM Dependencies`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `Radio Impacto Digital` (e.g. with `APK Download Redirect` and `Google Site Verification`) actually correct?**
  _`Radio Impacto Digital` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `allow`, `$schema`, `plugin` to the rest of the system?**
  _104 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Radio Station Core Config` be split into smaller, more focused modules?**
  _Cohesion score 0.06218487394957983 - nodes in this community are weakly interconnected._
- **Should `UI Icon Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1339031339031339 - nodes in this community are weakly interconnected._