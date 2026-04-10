"use client"

import { useReducedMotion } from "framer-motion"
import type { Variants } from "framer-motion"

import {
    containerVariants,
    itemVariants,
    cardVariants,
    staggerContainerVariants,
} from "@/lib/utils/animations"

const instantTransition = { duration: 0, delay: 0 }

const reducedContainer: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0, delayChildren: 0 },
    },
}

const reducedItem: Variants = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: instantTransition },
}

const clsSafeItem: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
}

const reducedClsSafeItem: Variants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: instantTransition },
}

export function useContainerVariants(): Variants {
    const shouldReduce = useReducedMotion()

    if (shouldReduce)
        return reducedContainer

    return containerVariants
}

export function useStaggerContainerVariants(): Variants {
    const shouldReduce = useReducedMotion()

    if (shouldReduce)
        return reducedContainer

    return staggerContainerVariants
}

export function useItemVariants(options?: { clsSafe?: boolean }): Variants {
    const shouldReduce = useReducedMotion()

    if (shouldReduce)
        return options?.clsSafe ? reducedClsSafeItem : reducedItem

    return options?.clsSafe ? clsSafeItem : itemVariants
}

export function useCardVariants(options?: { clsSafe?: boolean }): Variants {
    const shouldReduce = useReducedMotion()

    if (shouldReduce)
        return options?.clsSafe ? reducedClsSafeItem : reducedItem

    return options?.clsSafe ? clsSafeItem : cardVariants
}

export function useAnimationVariants() {
    const shouldReduce = useReducedMotion()

    if (shouldReduce)
        return {
            containerVariants: reducedContainer,
            staggerContainerVariants: reducedContainer,
            itemVariants: reducedItem,
            cardVariants: reducedItem,
        }

    return {
        containerVariants,
        staggerContainerVariants,
        itemVariants,
        cardVariants,
    }
}

export function useInteractionVariants(type: "button" | "micro"): Variants {
    const shouldReduce = useReducedMotion()

    if (shouldReduce)
        return { hover: {}, tap: {} }

    if (type === "button") {
        return {
            hover: { scale: 1.02, transition: { duration: 0.2 } },
            tap: { scale: 0.98, transition: { duration: 0.1 } },
        }
    }

    return {
        hover: { scale: 1.05, transition: { duration: 0.15 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } },
    }
}
