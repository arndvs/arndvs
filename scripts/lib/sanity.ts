import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

export function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
}

export function createSanityClient() {
    return createClient({
        projectId: requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"),
        dataset: requireEnv("NEXT_PUBLIC_SANITY_DATASET"),
        apiVersion: requireEnv("NEXT_PUBLIC_SANITY_API_VERSION"),
        token: requireEnv("SANITY_API_TOKEN"),
        useCdn: false,
    });
}
