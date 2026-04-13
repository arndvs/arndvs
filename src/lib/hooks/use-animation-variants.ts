"use client";

import { useReducedMotion } from "framer-motion";

import {
    cardVariants,
    containerVariants,
    itemVariants,
    staggerContainerVariants,
} from "@/lib/utils/animations";

const instantTransition = { duration: 0, delay: 0 };

const reducedContainer = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0, delayChildren: 0 },
    },
};

const reducedItem = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: instantTransition },
};

export function useAnimationVariants() {
    const shouldReduce = useReducedMotion();

    if (shouldReduce)
        return {
            containerVariants: reducedContainer,
            staggerContainerVariants: reducedContainer,
            itemVariants: reducedItem,
            cardVariants: reducedItem,
        };

    return {
        containerVariants,
        staggerContainerVariants,
        itemVariants,
        cardVariants,
    };
}
