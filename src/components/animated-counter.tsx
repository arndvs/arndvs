"use client";

import { animate, useInView } from "framer-motion";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export function AnimatedCounter({ value, suffix, prefix, className }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        const controls = animate(0, value, {
            duration: 1.5,
            ease: [0.25, 0.46, 0.45, 0.94],
            onUpdate: (v) => setDisplay(Math.round(v)),
        });

        return controls.stop;
    }, [isInView, value]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {display.toLocaleString()}
            {suffix}
        </span>
    );
}
