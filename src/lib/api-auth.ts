import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth-guard";

/**
 * Auth guard for API routes.
 * Returns the session when authenticated, or a 401 response.
 * API routes can't use redirect() — they must return a response.
 */
export async function requireApiAuth(
    request: NextRequest,
): Promise<{ session: Awaited<ReturnType<typeof getSession>> } | { response: NextResponse }> {
    const session = await getSession();

    if (!session) {
        return {
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    // Defense-in-depth: for state-changing methods, require a same-origin
    // request. SameSite=Lax already blocks cross-site POST cookies, but this
    // adds a second layer if cookie policy ever changes. GET is safe to allow
    // cross-origin (no state change).
    const method = request.method.toUpperCase();
    if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
        const origin = request.headers.get("origin");
        const host = request.headers.get("host");
        if (origin && host) {
            try {
                const originHost = new URL(origin).host;
                if (originHost !== host) {
                    return {
                        response: NextResponse.json(
                            { error: "Cross-origin request rejected" },
                            { status: 403 },
                        ),
                    };
                }
            } catch {
                // Malformed origin — reject to be safe.
                return {
                    response: NextResponse.json({ error: "Invalid origin" }, { status: 403 }),
                };
            }
        }
    }

    return { session };
}

/** Helper: JSON response with consistent error shape. */
export function jsonError(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}
