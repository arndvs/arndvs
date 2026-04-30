# RipeMetrics WordPress Plugin — Portfolio Report

> Deep codebase audit of `ripemetrics-ripe-wp-plugin-f8365bb7e2d3` — a WordPress plugin that embeds the RipeMetrics live chat widget on any WordPress site.

---

## Executive Summary

RipeMetrics WP Plugin is a **single-purpose WordPress plugin** that embeds the RipeMetrics AI chat widget on WordPress sites. Store owners install the plugin, enter their Store ID and domain, and the plugin injects the `<client-chat-button-island>` Preact web component into the frontend. The widget script loads from the `ripe.chat` CDN — the same Preact Islands architecture used across the RipeMetrics ecosystem. A minimal single-class PHP plugin with admin settings page and zero external dependencies.

---

## Tech Stack

| Layer        | Technology                      |
| ------------ | ------------------------------- |
| Language     | PHP ≥7.2                        |
| Platform     | WordPress ≥5.0                  |
| Frontend     | Preact Island (loaded from CDN) |
| License      | GPLv2                           |
| Build tools  | None                            |
| Dependencies | None                            |

---

## Architecture

**Total files: 4.** This is intentionally lightweight.

```
ripemetrics-ripe-wp-plugin/
├── ripemetrics/
│   ├── ripemetrics.php    # v1.2.0 — current plugin file
│   └── readme.txt         # WordPress.org readme
└── old/
    └── ripemetrics.php    # v1.0.0 — original version
```

Single-class OOP design — `RipeMetrics_Plugin` registers all hooks in the constructor and is instantiated at file load. No autoloading, no namespaces, no build pipeline.

---

## Features

### 1. Admin Settings Page

Top-level admin menu item ("RipeMetrics") with custom SVG fruit icon in the sidebar. Card-style settings page with:

| Setting  | Type | Validation                                      |
| -------- | ---- | ----------------------------------------------- |
| Store ID | text | `sanitize_text_field()`, alphanumeric + hyphens |
| Domain   | URL  | `esc_url_raw()`                                 |

Admin notices warn across all admin pages if either field is unconfigured.

### 2. Chat Widget Injection

When both settings are configured:

1. Hooks into `wp_head`
2. Creates a `<client-chat-button-island>` custom element
3. Prepends it to `document.body`
4. Loads the UMD script from `https://ripe.chat/islands/client-chat-button.island.umd.js`
5. Passes `chatbotId` and `domain` as script attributes

Skipped on admin pages (`is_admin()` check). The loaded widget is the same Preact Islands chat component used across all RipeMetrics properties.

---

## WordPress Hooks Used

| Hook                    | Purpose                            |
| ----------------------- | ---------------------------------- |
| `admin_menu`            | Register top-level admin page      |
| `admin_init`            | Register settings via Settings API |
| `wp_head`               | Inject chat widget script          |
| `admin_notices`         | Display configuration warnings     |
| `admin_enqueue_scripts` | Load admin styles                  |

No custom hooks or filters provided.

---

## Database Footprint

- **2 `wp_options` rows**: `ripemetrics_store_id`, `ripemetrics_domain`
- No custom tables, no transients
- No cleanup on deactivation (no `uninstall.php`)

---

## Version Evolution (v1.0.0 → v1.2.0)

| Aspect           | v1.0.0                                      | v1.2.0                                    |
| ---------------- | ------------------------------------------- | ----------------------------------------- |
| Menu location    | Settings submenu                            | Top-level menu with SVG icon              |
| Script injection | `wp_enqueue_scripts` + `wp_localize_script` | Direct `wp_head` with inline `<script>`   |
| Config passing   | Meta tag + `window.RipeMetricsConfig`       | Script attributes (`chatbotId`, `domain`) |
| Admin notices    | None                                        | Configuration warning banner              |
| Class name       | `RipeMetricsPlugin`                         | `RipeMetrics_Plugin`                      |

---

## Security

- Input sanitization: `sanitize_text_field()`, `esc_url_raw()`
- Output escaping: `esc_attr()`, `esc_js()`, `esc_url()`
- Capability gate: `manage_options` (admin only)
- Nonce field present but handled by WordPress Settings API internally

---

## Key Takeaways for Portfolio

1. **WordPress distribution channel** — Extends RipeMetrics' reach to the WordPress ecosystem (43% of all websites)
2. **Preact Islands integration** — Demonstrates the cross-platform web component strategy — same `<client-chat-button-island>` works in WordPress, standalone HTML, React apps, and any CMS
3. **Zero-dependency design** — No composer, no npm, no build step — just PHP and a CDN script load
4. **Plugin lifecycle** — Shows evolution from Settings submenu to branded top-level menu with configuration validation

---

## Relationship to Other Repos

| Repo                             | Role                                                 |
| -------------------------------- | ---------------------------------------------------- |
| `ripemetrics-prod`               | Backend API — serves the chatbot responses           |
| `ripemetrics-reputation`         | Consumer frontend — also embeds the same chat widget |
| `ripemetrics-preact-islands`     | **Source of the chat widget** loaded by this plugin  |
| **`ripemetrics-ripe-wp-plugin`** | **This repo — WordPress distribution wrapper**       |
| `ripemetrics-app-frontend`       | Admin dashboard — where Store ID is managed          |
| `ripemetrics-ripe-changelog`     | Product changelog                                    |
| `ripemetrics-ripe-extractors`    | Content extraction pipeline                          |
| `ripemetrics-marketing-frontend` | Marketing website                                    |
