"use client";

import { CodeXml } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

const nameVariations = [
    { text: "Aaron Davis", style: "normal" },
    { text: "arndvs.com", style: "binary" },
];

const glitchChars = "!<>-_\\/[]{}—=+*^?#________";

export function GlitchName() {
    const [isHovering, setIsHovering] = useState(false);
    const [displayText, setDisplayText] = useState("Aaron Davis");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const identityIndexRef = useRef(0);

    const scrambleText = (target: string, progress: number) => {
        return target
            .split("")
            .map((char, index) => {
                if (char === " ") return " ";
                if (index < progress) return target[index];
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join("");
    };

    useEffect(() => {
        if (isHovering) {
            let progress = 0;
            const targetIndex = (identityIndexRef.current + 1) % nameVariations.length;
            const variation = nameVariations[targetIndex];

            if (!variation) return;

            const target = variation.text;

            glitchIntervalRef.current = setInterval(() => {
                progress += 1;
                if (progress <= target.length) {
                    setDisplayText(scrambleText(target, progress));
                } else {
                    setDisplayText(target);
                    identityIndexRef.current = targetIndex;
                    if (glitchIntervalRef.current) {
                        clearInterval(glitchIntervalRef.current);
                    }
                }
            }, 50);

            intervalRef.current = setInterval(() => {
                const nextIndex = (identityIndexRef.current + 1) % nameVariations.length;
                const nextVariation = nameVariations[nextIndex];

                if (!nextVariation) return;

                const nextTarget = nextVariation.text;
                let nextProgress = 0;

                if (glitchIntervalRef.current) {
                    clearInterval(glitchIntervalRef.current);
                }

                glitchIntervalRef.current = setInterval(() => {
                    nextProgress += 1;
                    if (nextProgress <= nextTarget.length) {
                        setDisplayText(scrambleText(nextTarget, nextProgress));
                    } else {
                        setDisplayText(nextTarget);
                        identityIndexRef.current = nextIndex;
                        if (glitchIntervalRef.current) {
                            clearInterval(glitchIntervalRef.current);
                        }
                    }
                }, 50);
            }, 2000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);

            let progress = 0;
            const target = "Aaron Davis";

            glitchIntervalRef.current = setInterval(() => {
                progress += 1;
                if (progress <= target.length) {
                    setDisplayText(scrambleText(target, progress));
                } else {
                    setDisplayText(target);
                    identityIndexRef.current = 0;
                    if (glitchIntervalRef.current) {
                        clearInterval(glitchIntervalRef.current);
                    }
                }
            }, 50);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current);
        };
    }, [isHovering]);

    return (
        <>
            <Link
                href="/"
                className="group flex cursor-pointer items-center gap-2 select-none"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                aria-label="Aaron Davis - Home"
            >
                <CodeXml
                    className={`transition-all duration-300 ${isHovering ? "text-primary rotate-180" : ""}`}
                    aria-hidden="true"
                />
                <span
                    aria-hidden="true"
                    className={`text-lg font-semibold tracking-tight transition-all duration-200 ${
                        isHovering ? "text-primary" : ""
                    }`}
                    style={{
                        fontFamily: "monospace",
                    }}
                >
                    {displayText}
                </span>
            </Link>
        </>
    );
}
