declare module "*.css";

// Static image imports — needed because next-env.d.ts is gitignored
// and unavailable during CI typecheck (tsc runs before next build)
declare module "*.webp" {
    const content: import("next/image").StaticImageData;
    export default content;
}
declare module "*.png" {
    const content: import("next/image").StaticImageData;
    export default content;
}
declare module "*.jpg" {
    const content: import("next/image").StaticImageData;
    export default content;
}
declare module "*.svg" {
    const content: string;
    export default content;
}