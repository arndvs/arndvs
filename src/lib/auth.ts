import { createHash, timingSafeEqual } from "node:crypto";

export function safeCompare(a: string, b: string): boolean {
    const hashA = createHash("sha256").update(a).digest();
    const hashB = createHash("sha256").update(b).digest();

    return timingSafeEqual(hashA, hashB);
}
