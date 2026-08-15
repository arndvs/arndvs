import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth-server";

/**
 * Server-side auth guard for the ops console.
 * Redirects to /login when there's no session.
 * Returns the session when authenticated.
 */
export async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    return session;
}

/**
 * Returns the session or null (for pages that can render both states).
 */
export async function getSession() {
    return auth.api.getSession({
        headers: await headers(),
    });
}
