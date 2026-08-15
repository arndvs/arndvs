"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client for the ops console.
 * Uses the same base URL as the server (from env).
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
});

export const { signIn, signOut, useSession } = authClient;
