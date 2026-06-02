"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { useState } from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

type AnimationStyle =
    | "from-bottom"
    | "from-center"
    | "from-top"
    | "from-left"
    | "from-right"
    | "fade"
    | "top-in-bottom-out"
    | "left-in-right-out";

interface HeroVideoProps {
    animationStyle?: AnimationStyle;
    videoSrc: string;
    thumbnailSrc: string;
    thumbnailAlt?: string;
    className?: string;
}

const animationVariants = {
    "from-bottom": {
        initial: { y: "100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0 },
    },
    "from-center": {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.5, opacity: 0 },
    },
    "from-top": {
        initial: { y: "-100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "-100%", opacity: 0 },
    },
    "from-left": {
        initial: { x: "-100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 0 },
    },
    "from-right": {
        initial: { x: "100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0 },
    },
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    "top-in-bottom-out": {
        initial: { y: "-100%", opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0 },
    },
    "left-in-right-out": {
        initial: { x: "-100%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0 },
    },
};

export default function HeroVideoDialog({
    animationStyle = "from-center",
    videoSrc,
    thumbnailSrc,
    thumbnailAlt = "Video thumbnail",
    className,
}: HeroVideoProps) {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const selectedAnimation = animationVariants[animationStyle];

    // Add autoplay parameter to video URL when dialog opens
    const autoplayVideoSrc = `${videoSrc}${videoSrc.includes("?") ? "&" : "?"}autoplay=1`;

    return (
        <DialogPrimitive.Root open={isVideoOpen} onOpenChange={setIsVideoOpen}>
            <div className={cn("relative", className)}>
                <DialogPrimitive.Trigger asChild>
                    <button
                        type="button"
                        className="group relative w-full cursor-pointer"
                        aria-label={`Play video: ${thumbnailAlt}`}
                    >
                        <Image
                            src={thumbnailSrc}
                            alt={thumbnailAlt}
                            width={1920}
                            height={1080}
                            className="w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
                        />
                        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
                            <div className="bg-primary/10 flex size-28 items-center justify-center rounded-full opacity-90 backdrop-blur-md">
                                <div
                                    className={`from-primary/30 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}
                                >
                                    <Play
                                        className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                                        style={{
                                            filter: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </button>
                </DialogPrimitive.Trigger>
            </div>
            <AnimatePresence>
                {isVideoOpen && (
                    <DialogPrimitive.Portal forceMount>
                        <DialogPrimitive.Overlay forceMount asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[2147483640] bg-black/50 backdrop-blur-md"
                            />
                        </DialogPrimitive.Overlay>
                        <DialogPrimitive.Content forceMount asChild>
                            <motion.div
                                {...selectedAnimation}
                                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                className="fixed inset-0 z-[2147483641] flex items-center justify-center"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) setIsVideoOpen(false);
                                }}
                            >
                                <DialogPrimitive.Title className="sr-only">
                                    {thumbnailAlt}
                                </DialogPrimitive.Title>
                                <div className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0">
                                    <DialogPrimitive.Close asChild>
                                        <button
                                            type="button"
                                            className="absolute -top-16 right-0 z-[2147483647] rounded-full bg-blue-500 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black"
                                        >
                                            <XIcon className="size-5" />
                                            <span className="sr-only">Close</span>
                                        </button>
                                    </DialogPrimitive.Close>
                                    <div className="relative isolate size-full overflow-hidden rounded-2xl border-2 border-white">
                                        <div className="relative w-full pt-[56.25%]">
                                            <video
                                                src={isVideoOpen ? autoplayVideoSrc : videoSrc}
                                                className="absolute top-0 left-0 z-[2147483647] size-full rounded-2xl"
                                                controls
                                                autoPlay={isVideoOpen}
                                                playsInline
                                                muted
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                )}
            </AnimatePresence>
        </DialogPrimitive.Root>
    );
}
