import { config } from "dotenv";
import { defineCliConfig } from "sanity/cli";

config({ path: ".env.local" });

const requiredEnvVars = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
} as const;

const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

if (missingEnvVars.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}\n` +
            "Please check your .env.local file and ensure all required variables are set.",
    );
}

export default defineCliConfig({
    api: {
        projectId: requiredEnvVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: requiredEnvVars.NEXT_PUBLIC_SANITY_DATASET,
    },
    typegen: {
        enabled: true,
        path: "./src/**/*.{ts,tsx}",
        generates: "./src/sanity/types.ts",
        overloadClientMethods: true,
    },
});
