# RipeMetrics Preact Islands — Portfolio Report

> Deep codebase audit of `ripemetrics-ripemetrics-preact-islands-75fef5ddcb71` — embeddable AI chatbot widgets built as Web Component islands using Preact.

---

## Executive Summary

RipeMetrics Preact Islands is a **cross-platform embeddable widget system** that delivers the RipeMetrics AI chatbot as self-contained Web Components. Using the `preact-island` library, each widget registers as a Custom Element (e.g., `<client-chat-button-island>`) with Shadow DOM style isolation. A single `<script>` tag on any website — WordPress, Shopify, static HTML, React, or any CMS — loads the widget with zero configuration beyond a store ID. The primary widget is a floating chat bubble that opens a real-time AI-powered conversational interface with **Pusher WebSocket streaming**, cookie-based session persistence, and server-driven multi-tenant theming. Built with **Preact 10 + TypeScript**, bundled as **UMD modules via Webpack 5**, and deployed on **Netlify**.

---

## Tech Stack

| Layer           | Technology                                                  |
| --------------- | ----------------------------------------------------------- |
| UI Framework    | Preact 10.5 (with `@preact/compat` for React API)           |
| Language        | TypeScript 4.6 (ES2015 target)                              |
| Bundler         | Webpack 5 (UMD output per island)                           |
| Styling         | Tailwind CSS 3.4 + Vanilla Extract (zero-runtime CSS-in-TS) |
| Style Isolation | Shadow DOM + custom `style-loader` injection                |
| Real-time       | Pusher.js + Laravel Echo (WebSocket streaming)              |
| HTTP            | Axios + Redaxios                                            |
| Markdown        | react-markdown (bot message rendering)                      |
| Animation       | Framer Motion 11                                            |
| Validation      | Zod                                                         |
| Testing         | Playwright (E2E, browser-based)                             |
| Monitoring      | Sentry (configured, disabled in production)                 |
| Deployment      | Netlify (static UMD bundles)                                |
| CI              | GitHub Actions (Playwright on push/PR)                      |

---

## Architecture

### Island Pattern

Each widget follows an identical lifecycle:

1. **Auto-discovery**: Webpack globs `./src/islands/**/*.island.{ts,tsx}` for entry points
2. **Custom Element registration**: `createIslandWebComponent(name, Component)` registers a Web Component (e.g., `<client-chat-button-island>`)
3. **Shadow DOM isolation**: Styles injected into each island's Shadow DOM via a custom `style-loader` that listens for `web-component-mount` CustomEvents
4. **Dynamic insertion**: `useDynamicWebIsland` hook auto-creates the custom element in the DOM — consumers just load the script
5. **Portal escaping**: Modals and overlays use `WebComponentPortal` to render outside the Shadow DOM boundary

### Embedding — Single Script Tag

```html
<script
    src="https://ripe.chat/islands/client-chat-button.island.umd.js"
    chatbotId="144"
    domain="https://example.com"
></script>
```

| Attribute   | Purpose                                |
| ----------- | -------------------------------------- |
| `chatbotId` | Store ID for API calls and branding    |
| `domain`    | Host domain for cookie scoping         |
| `env`       | Environment flag (omit for production) |

No HTML tag needed — the script auto-inserts the custom element.

### Build Output

Each island compiles to a standalone **UMD bundle** at `dist/islands/[name].island.umd.js` with all CSS inlined as `<style>` tags (zero external requests). Custom `IslandFileSizePlugin` reports original/gzip/brotli sizes at build time.

---

## All Islands (8)

### Production Islands

| Island                   | Custom Element                  | Purpose                                                                         |
| ------------------------ | ------------------------------- | ------------------------------------------------------------------------------- |
| **client-chat-button**   | `<client-chat-button-island>`   | Primary widget — floating chat bubble + modal overlay with real-time AI chatbot |
| **client-chat-panel**    | `<client-chat-panel-island>`    | Inline chat panel — embeds chatbot directly in page layout (no floating button) |
| **chatbot-context-data** | `<chatbot-context-data-island>` | Debug/admin tool — displays all chatbot context values in a table               |

### Marketing / Demo Islands

| Island                | Custom Element               | Purpose                                                                        |
| --------------------- | ---------------------------- | ------------------------------------------------------------------------------ |
| **marketing-chatbot** | `<marketing-chatbot-island>` | Demo chatbot with hardcoded "Ignite Fitness" branding and sample conversations |
| **open-panel**        | `<marketing-panel-island>`   | Full-page marketing panel with static demo conversation                        |

### Starter / Dev Islands

| Island                 | Custom Element                | Purpose                                                       |
| ---------------------- | ----------------------------- | ------------------------------------------------------------- |
| **pokemon**            | `<pokemon-island>`            | Demo/starter — PokéAPI search widget                          |
| **subscribe-email**    | `<subscribe-email-island>`    | Demo — email subscribe with WebComponentPortal modal          |
| **tailwind-indicator** | `<tailwind-indicator-island>` | Dev tool — shows current breakpoint, screen size, pixel ratio |

---

## Client Chat Button — Component Architecture

```
ClientChatButtonIsland
└── ClientChatButtonComponent
    └── ChatbotContextProvider              ← Preact Context for all state
        └── ActionProvider                  ← Chat stream + loading management
            ├── ChatBubbleButton            ← Floating FAB (fixed bottom-right)
            └── ChatModal (WebComponentPortal)
                ├── ChatOverlay (portal)
                │   └── Chatbot
                │       └── ChatbotContainer
                │           ├── ChatbotHeaderContainer
                │           │   ├── ChatbotAvatar
                │           │   ├── ResetChatButton
                │           │   └── CloseChatButton
                │           ├── ChatbotMessageRetriever
                │           │   ├── ChatbotMessageComponent (bot)
                │           │   │   └── ReactMarkdown
                │           │   │   └── ChatbotLoadingDots
                │           │   └── ChatbotUserMessage (user)
                │           └── ChatbotFooterContainer
                │               ├── ChatbotInputContainer
                │               └── ChatbotPoweredBy
                └── ChatOverlay (dimmer portal)
```

---

## API Integration

| Endpoint                                                            | Method | Purpose                                            |
| ------------------------------------------------------------------- | ------ | -------------------------------------------------- |
| `/api/v2/external_chatbot_initial_settings/{storeId}`               | POST   | Fetch store branding, session ID, greeting, colors |
| `/api/v2/external_chatbot`                                          | POST   | Send user message (question, store_id, session_id) |
| `/api/v2/external_chatbot/message_history/{customerId}/{sessionId}` | GET    | Retrieve prior conversation                        |
| `/api/broadcasting/reputation`                                      | POST   | Pusher auth for private WebSocket channels         |

**Real-time streaming**: Pusher private channel `chat-stream-external-{store_id}-{session_id}` delivers sequenced text chunks assembled in order with loading/completion states.

**Base URL**: `process.env.CHAT_API_URL` (production) or `https://api.rmdevs.com` (dev via `env` attribute).

---

## Style Isolation Strategy

Multiple layers protect against host page CSS interference:

1. **Shadow DOM**: All island content renders inside a Shadow Root
2. **Custom `style-loader` injection**: `web-component-mount` CustomEvent triggers style tag prepend into the shadow root
3. **`all: initial` wrapper**: Resets all inherited CSS properties at the island boundary
4. **Webpack Layers**: `experiments.layers: true` ensures CSS isolation per entry point
5. **Inline styles**: All CSS bundled as `<style>` tags inside the UMD — no external CSS files

---

## Multi-Tenant Theming

All branding is server-driven per store via the initial settings API:

| Property           | Customizable              |
| ------------------ | ------------------------- |
| Header color       | Store's brand color       |
| Button color       | Chat bubble background    |
| User message color | Message bubble background |
| Font color         | Text color                |
| Bot name           | Store's chatbot name      |
| Avatar             | Store's logo/avatar image |
| Greeting           | Initial bot message       |
| Chat icon          | Floating button icon      |

---

## Key Technical Patterns

| Pattern                       | Detail                                                                      |
| ----------------------------- | --------------------------------------------------------------------------- |
| Web Component Custom Elements | Each island registers as `<{name}-island>` via `createIslandWebComponent()` |
| Shadow DOM style injection    | Custom `style-loader` + `web-component-mount` CustomEvent system            |
| WebComponentPortal            | Modals escape Shadow DOM boundaries using `preact-island` portals           |
| Dynamic auto-insertion        | `useDynamicWebIsland` hook — consumers just load the script                 |
| Real-time AI streaming        | Pusher private channels deliver sequenced text chunks                       |
| Client-side rate limiting     | 10 messages per 60-second window with user alerts                           |
| Input sanitization            | HTML entities escaped before sending                                        |
| Markdown rendering            | Bot responses via `react-markdown` with safe link/image components          |
| Cookie-based sessions         | `ripemetrics_chatbot-{type}` cookie stores session for continuity           |
| "Powered by RipeMetrics"      | Watermark with referrer tracking link                                       |

---

## Key Technical Achievements

1. **Universal embeddability** — Single `<script>` tag works on any website: WordPress, Shopify, React, static HTML, any CMS — zero dependencies on the host
2. **Shadow DOM style isolation** — Multi-layered CSS isolation prevents host page interference and vice versa
3. **Real-time AI chat streaming** — Pusher WebSocket channels deliver sequenced text chunks for GPT-style streaming responses
4. **Server-driven multi-tenant theming** — One codebase, unlimited client stores, all branding from API
5. **Portal-based modal system** — Overlays escape Shadow DOM boundaries while maintaining component context
6. **Dynamic self-insertion** — Islands auto-create their DOM elements on script load — no HTML changes needed
7. **Cross-platform session persistence** — Cookie-based conversation continuity across page loads and navigation
8. **Zero-external-request bundles** — All CSS inlined into UMD bundles, eliminating render-blocking requests
9. **Playwright E2E testing** — Browser-based testing with CI pipeline on GitHub Actions
10. **Webpack Layer isolation** — Per-island CSS scoping at the build level prevents cross-contamination

---

## Relationship to Other Repos

| Repo                             | Role                                                                      |
| -------------------------------- | ------------------------------------------------------------------------- |
| `ripemetrics-prod`               | Backend API — serves chatbot responses, initial settings, message history |
| `ripemetrics-reputation`         | Consumer frontend — also embeds the chat widget                           |
| `ripemetrics-ripe-wp-plugin`     | WordPress plugin — loads this widget via `<script>` tag                   |
| `ripemetrics-marketing-frontend` | Marketing site — embeds this widget for demos                             |
| **`ripemetrics-preact-islands`** | **This repo — the embeddable widget system**                              |
| `ripemetrics-app-frontend`       | Admin dashboard                                                           |
| `ripemetrics-ripe-changelog`     | Product changelog                                                         |
| `ripemetrics-ripe-extractors`    | Content extraction pipeline                                               |
