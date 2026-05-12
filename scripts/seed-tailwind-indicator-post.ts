/**
 * Seed script — creates the tailwind-indicator blog post in Sanity.
 * Run: npx tsx scripts/seed-tailwind-indicator-post.ts
 */
import { createSanityClient } from "./lib/sanity";

const client = createSanityClient();

const post = {
    _type: "post",
    _id: "post-tailwind-indicator",
    title: "I Published a 4 KB npm Package That Shows Your Tailwind Breakpoint",
    slug: { _type: "slug", current: "tailwind-indicator" },
    author: "Aaron Davis",
    publishedAt: new Date().toISOString(),
    excerpt:
        "A zero-dependency Web Component that shows the current Tailwind breakpoint, viewport size, orientation, and pixel ratio. Born from debugging a 129-component CRM with four different calc(100vh) magic numbers and two competing breakpoint systems.",
    tldr: "npm install tailwind-indicator, drop <tailwind-indicator /> in your layout, and always know which breakpoint you're targeting. 4 KB, zero deps, works everywhere.",
    categories: ["Open Source", "Tailwind CSS", "Web Components", "TypeScript", "npm"],
    seo: {
        _type: "seo",
        metaTitle: "tailwind-indicator — See Your Tailwind Breakpoint While You Code",
        metaDescription:
            "A 4 KB Web Component that shows the active Tailwind breakpoint, viewport dimensions, and pixel ratio. Zero dependencies, works in any framework.",
        focusKeyword: "tailwind breakpoint indicator",
        keywords: [
            "tailwind breakpoint",
            "responsive design",
            "web component",
            "npm package",
            "tailwindcss debug",
        ],
    },
    body: [
        // ── The Problem ──
        block("h2", "129 Components Across 39 Directories"),
        block(
            "normal",
            "The RipeMetrics CRM has a Communication CRM page. On paper it sounds simple: a customer list on the left, a messaging panel on the right. In practice, the right panel alone is a vertical stack of three components — a customer header, a messaging dashboard with six tabbed channels (calendar, notes, chat, email, SMS, voice calls), and a timeline that renders seven different item types (messages, emails, orders, notes, voice calls, chatbot messages, and feedback surveys). Each of those item types is its own component, and some of them nest further — the feedback item contains star ratings and text responses, the message item has an attachment modal, the order item renders a responsive data table.",
        ),
        block(
            "normal",
            "The customer list on the left isn't simple either. Each card renders an avatar, a name, an assigned agent badge, a latest message preview, a timestamp, an assigned status indicator, and a channel icon. The list has a filter bar that renders three filter controls on desktop — but on mobile, it renders an entirely separate MobileFilters component that duplicates the same three filters inside a slide-out Sheet with accordion sections. The desktop and mobile filter UIs are toggled with lg:hidden and hidden lg:flex — two completely different DOM trees for the same data.",
        ),

        // ── The Real Pain ──
        block("h2", "The calc(100vh - 136px) Problem"),
        block(
            "normal",
            "Every full-height CRM view computes its container height by subtracting the layout chrome from the viewport. The Communication CRM uses h-[calc(100vh-136px)]. The Contact Profile page uses calc(100vh - 144px) — eight more pixels, because it has a different page header. The Kanban board uses calc(100vh - 207px). The scheduling assistant uses calc(100vh - 136px) again. Each of these magic numbers assumes a fixed height for the navbar, page header, and any tab bars above the content area. If any of those elements changes height at a breakpoint, the math breaks.",
        ),
        block(
            "normal",
            "And the elements do change height at breakpoints. The ChosenCustomerHeader component renders completely different layouts for mobile and desktop. On mobile (sm:hidden), it shows a compact row with a collapsible chevron that expands to reveal a 3-column grid of dropdowns. On desktop (hidden sm:flex), it shows a horizontal bar with the customer info and controls laid out side by side. The messaging dashboard tabs use MUI's useMediaQuery to switch between text labels on desktop and icon-only tooltips on mobile. The direct messenger buttons go from grid-cols-2 on mobile to md:grid-cols-7 with individual items spanning col-span-1 or md:col-span-2 depending on which breakpoint is active.",
        ),
        block(
            "normal",
            "When you're resizing the browser and something overflows, truncates, or wraps at an unexpected width, the first question is always: which breakpoint did I just cross? Was that the sm threshold or the md threshold? Is this a Tailwind breakpoint issue or a MUI breakpoint issue? This codebase uses both systems — Tailwind responsive classes and MUI's useMediaQuery with theme.breakpoints.down('sm') — and they don't share the same pixel values.",
        ),

        // ── Origin Story ──
        block("h2", "From CRM Debug Tool to npm Package"),
        block(
            "normal",
            "That's where the breakpoint indicator started. Not as a package — as a survival tool. I needed to know, at a glance, whether I was looking at a layout bug at 639px or 640px. The first version was a React component mounted globally in the platform's _app.tsx, gated behind a NEXT_PUBLIC_TAILWIND_DEV_BAR environment variable. It used MUI's Box for z-index stacking, localStorage to persist its visibility state, and even had a button to toggle an auth debug panel. It was purpose-built for the internal CRM dashboard.",
        ),
        block(
            "normal",
            "But the RipeMetrics ecosystem wasn't just the internal dashboard. The AI chatbot widgets lived on customer sites — WordPress stores, Shopify storefronts, other people's platforms. When a chatbot widget broke at a certain viewport width on a customer's site, I couldn't use the internal indicator because I wasn't in the Next.js app. I needed the same tool, but loadable as a standalone script on any site. That's what led to the Preact Islands version — a lightweight chatbot bundle that could be injected onto any page via a script tag, with the breakpoint indicator riding alongside it for responsive debugging.",
        ),
        block(
            "normal",
            "So the indicator existed in two forms: a React component inside _app.tsx for the internal CRM, and a Preact Island for debugging chatbot widgets on external customer sites. When I later cleaned up the Preact widget — stripping 40+ dead files, fixing security bugs, removing vendor branding — the breakpoint indicator was one of the things I deleted from that codebase. But the underlying need hadn't gone away. Two framework-specific copies of the same tool was the problem. So I rebuilt it once, as a vanilla Web Component: no React, no Preact, no framework dependency at all. One package that works in _app.tsx, on a customer's WordPress site, in a Next.js layout, or anywhere else a browser runs.",
        ),

        // ── What It Does ──
        block("h2", "What tailwind-indicator Shows"),
        block(
            "normal",
            "A small pill fixed to the corner of your screen that displays four things at a glance: the current Tailwind breakpoint name (xs, sm, md, lg, xl, 2xl), viewport dimensions in pixels, screen orientation, and device pixel ratio. It updates in real-time as you resize.",
        ),
        codeBlock(
            `import 'tailwind-indicator';

// That's it. Drop the element in your HTML:
// <tailwind-indicator></tailwind-indicator>`,
            "typescript",
            "usage.ts",
        ),
        block(
            "normal",
            "The viewport dimensions are the part I use most. When a CRM layout breaks at 1019px, I can see immediately that I'm 5 pixels below lg (1024px) and know exactly which responsive class to adjust. No DevTools, no mental math.",
        ),

        // ── Why a Web Component ──
        block("h2", "Why a Web Component Instead of React"),
        block(
            "normal",
            "The existing solutions I found all have the same limitation: they're React components. Adam Richardson's popular approach renders hidden divs using Tailwind utility classes — sm:block md:hidden and so on — to detect the current breakpoint. It's clever but framework-locked, and it requires Tailwind CSS to actually be loaded on the page for the utility classes to work.",
        ),
        block(
            "normal",
            "A Web Component with Shadow DOM solves both problems. The styles are self-contained — no Tailwind on the page required. The breakpoint detection uses window.innerWidth against a breakpoint map, not CSS class visibility tricks. It works in React, Next.js, Preact, Svelte, Astro, a plain HTML file, or the CRM that mixes Tailwind with MUI.",
        ),

        // ── Implementation ──
        block("h2", "How It Works Under the Hood"),
        block(
            "normal",
            "The component is a single class extending HTMLElement. It attaches a Shadow DOM for style isolation, listens to window resize events, and computes the current breakpoint by sorting breakpoint entries in descending order and finding the first one where the viewport width meets or exceeds the threshold.",
        ),
        codeBlock(
            `private _currentBreakpoint(width: number): string {
  const sorted = Object.entries(this._breakpoints).sort(
    ([, a], [, b]) => b - a
  );
  return sorted.find(([, value]) => width >= value)?.[0] ?? 'xs';
}`,
            "typescript",
            "breakpoint-detection.ts",
        ),
        block(
            "normal",
            "The default breakpoints match Tailwind v3: xs at 0, sm at 640, md at 768, lg at 1024, xl at 1280, and 2xl at 1536. You can override them with a JSON attribute for Tailwind v4 or custom configurations.",
        ),
        codeBlock(
            `<tailwind-indicator
  breakpoints='{"sm":480,"md":768,"lg":1024,"xl":1440}'
></tailwind-indicator>`,
            "html",
            "custom-breakpoints.html",
        ),

        // ── Competitive Analysis ──
        block("h2", "What I Took From Other Implementations"),
        block(
            "normal",
            "DevDojo's tailwind-breakpoint-tool had a good idea I hadn't considered: auto-hide. Their tool only appears during resize and fades out after 3 seconds of inactivity. I added that as an opt-in auto-hide attribute, along with a close button that appears on hover. By default, the indicator stays visible — in a layout as complex as a CRM, I want persistent awareness, not transient hints. But for simpler projects, the auto-hide option is there.",
        ),

        // ── Features ──
        block("h2", "Configuration"),
        block(
            "normal",
            "Everything is configurable through HTML attributes. Position the indicator in any corner. Set a custom keyboard shortcut to toggle visibility. Enable auto-hide to fade out after a period of no resize activity.",
        ),
        codeBlock(
            `<!-- Top-right corner, auto-hide after 3 seconds, custom hotkey -->
<tailwind-indicator
  position="top-right"
  auto-hide="3000"
  hotkey="ctrl+shift+d"
></tailwind-indicator>`,
            "html",
            "configuration.html",
        ),
        block(
            "normal",
            "The close button appears on hover — click it to dismiss the indicator entirely. The keyboard shortcut (Ctrl+Shift+T by default) toggles it back. For the auto-hide mode, the indicator reappears automatically on the next resize event.",
        ),

        // ── Next.js Integration ──
        block("h2", "Using It in Next.js"),
        block(
            "normal",
            "Import the package in your root layout and conditionally render the element in development. Since it's a custom element, TypeScript will complain — suppress it with a ts-expect-error comment.",
        ),
        codeBlock(
            `// app/layout.tsx
import 'tailwind-indicator';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && (
          // @ts-expect-error — custom element
          <tailwind-indicator />
        )}
      </body>
    </html>
  );
}`,
            "tsx",
            "app/layout.tsx",
        ),

        // ── Build ──
        block("h2", "The Build"),
        block(
            "normal",
            "tsup produces ESM (4.5 KB), CommonJS (5 KB), and TypeScript declarations. No runtime dependencies. The entire package is smaller than most favicons.",
        ),
        codeBlock(
            `// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
});`,
            "typescript",
            "tsup.config.ts",
        ),

        // ── Links ──
        block("h2", "Try It"),
        block(
            "normal",
            "Install from npm: npm install tailwind-indicator. Source on GitHub: github.com/arndvs/tailwind-indicator. One import, one element, and you'll never have to guess your breakpoint again.",
        ),
    ],
};

// ── Helpers ──

function block(style: string, text: string) {
    return {
        _type: "block",
        _key: randomKey(),
        style,
        markDefs: [],
        children: [
            {
                _type: "span",
                _key: randomKey(),
                text,
                marks: [],
            },
        ],
    };
}

function codeBlock(code: string, language: string, filename: string) {
    return {
        _type: "codeBlock",
        _key: randomKey(),
        code,
        language,
        filename,
    };
}

function randomKey() {
    return Math.random().toString(36).substring(2, 14);
}

async function main() {
    console.log("Creating tailwind-indicator blog post...");
    const result = await client.createOrReplace(post);
    console.log(`✓ Created post: ${result._id}`);
    console.log(`  Slug: ${post.slug.current}`);
    console.log(`  URL: /blog/${post.slug.current}`);
}

main().catch((err) => {
    console.error("Failed to seed blog post:", err);
    process.exit(1);
});
