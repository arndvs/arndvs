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

    return { session };
}

/** Helper: JSON response with consistent error shape. */
export function jsonError(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}
