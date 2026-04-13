import nextConfig from "eslint-config-next";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = [
    ...nextConfig,
    {
        plugins: {
            "unused-imports": unusedImports,
        },
        rules: {
            "unused-imports/no-unused-imports": "warn",
            "no-console": ["warn", { allow: ["error", "warn"] }],
        },
    },
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "scripts/**",
            "next-env.d.ts",
        ],
    },
];

export default eslintConfig;
