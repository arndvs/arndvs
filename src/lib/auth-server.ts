import { betterAuth } from "better-auth";

/**
 * Better Auth server config for the ops console.
 *
 * Stateless mode (no database — Sanity is the store, auth sessions live in
 * signed cookies via cookieCache). Email/password only. CSRF + origin checks
 * via trustedOrigins. Rate limiting enabled in production.
 *
 * Disabled-fallback: if BETTER_AUTH_SECRET is unset, auth routes return 503
 * (lifted from Launch Core's createDisabledAuth pattern) so the app boots
 * cleanly in dev/demo without auth configured.
 */

const hasAuthSecret = Boolean(process.env.BETTER_AUTH_SECRET);

export const auth = hasAuthSecret
    ? betterAuth({
          appName: "arndvs",
          baseURL: process.env.BETTER_AUTH_URL,
          emailAndPassword: {
              enabled: true,
          },
          // Stateless: sessions in signed cookies, no DB.
          session: {
              cookieCache: {
                  enabled: true,
                  maxAge: 60 * 60 * 24 * 7, // 7 days
              },
          },
          trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
          rateLimit: {
              enabled: true,
              window: 10,
              max: 100,
          },
      })
    : createDisabledAuth();

/**
 * A stub auth handler that returns 503 on every route — used when
 * BETTER_AUTH_SECRET isn't configured. Keeps the app bootable in dev.
 */
function createDisabledAuth() {
    return {
        handler: async (request: Request) =>
            new Response(
                JSON.stringify({
                    error: "Authentication is not configured. Set BETTER_AUTH_SECRET.",
                }),
                { status: 503, headers: { "Content-Type": "application/json" } },
            ),
        api: {
            getSession: async () => null,
        },
    };
}
