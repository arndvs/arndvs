"use client";

/** Scrolls to an element and outlines it briefly, so "Show where" lands somewhere visible. */
export const flash = (id: string): void => {
    const element = document.getElementById(id);
    if (!element) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    element.dataset.flash = "false";
    void element.offsetWidth;
    element.dataset.flash = "true";
    window.setTimeout(() => {
        element.dataset.flash = "false";
    }, 1600);
};
