/**
 * Single source of truth for the arndvs.com identity.
 *
 * Lifted from Launch Core's `brand.ts` pattern: pure constants, zero imports,
 * no `process.env`. Every consumer (app, scripts, engine) imports from here.
 */
export const BRAND = {
    appName: "Aaron Davis",
    slug: "arndvs",
    appUrl: "https://arndvs.com",
    supportEmail: "aaron@arndvs.com",
    jobTitle: "Full-Stack Engineer & Creative Technologist",
    social: {
        github: "https://github.com/arndvs",
        linkedin: "https://linkedin.com/in/arndvs",
        email: "mailto:aaron@arndvs.com",
    },
} as const;

export type Brand = typeof BRAND;
