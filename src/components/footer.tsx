"use client";

import { motion } from "framer-motion";

import Link from "next/link";

import { SOCIAL_LINKS } from "@/lib/data/social";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

const footerData = {
    brand: {
        name: "Aaron Davis",
        description: "Full-stack engineer and creative technologist based in San Diego.",
    },
    navigation: [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Projects", href: "/projects" },
        { name: "Blog", href: "/blog" },
        { name: "Work with me", href: "/work-with-me" },
    ],
    social: SOCIAL_LINKS,
    location: "San Diego, CA",
};
export function Footer() {
    const currentYear = new Date().getFullYear();
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <footer className="border-border border-t">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mx-auto max-w-7xl px-6 py-16 lg:px-12 xl:px-20"
            >
                <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
                    {/* Brand */}
                    <motion.div variants={itemVariants} className="max-w-xs">
                        <Link
                            href="/"
                            className="font-display hover:text-primary text-lg font-bold tracking-tight transition-colors"
                        >
                            {footerData.brand.name}
                        </Link>
                        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                            {footerData.brand.description}
                        </p>
                    </motion.div>

                    {/* Navigation */}
                    <motion.div variants={itemVariants}>
                        <nav
                            className="flex flex-wrap gap-x-8 gap-y-4"
                            aria-label="Footer navigation"
                        >
                            {footerData.navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>

                    {/* Social */}
                    <motion.div variants={itemVariants}>
                        <nav className="flex items-center gap-4" aria-label="Social links">
                            {footerData.social.map((social) => {
                                const Icon = social.icon;
                                const isMailto = social.href.startsWith("mailto");
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target={isMailto ? undefined : "_blank"}
                                        rel={isMailto ? undefined : "noopener noreferrer"}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={social.ariaLabel}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                );
                            })}
                        </nav>
                    </motion.div>
                </div>

                {/* Bottom */}
                <motion.div
                    variants={itemVariants}
                    className="border-border mt-16 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p className="text-muted-foreground text-xs">
                        © {currentYear} {footerData.brand.name}. All rights reserved.
                    </p>
                    <p className="text-muted-foreground text-xs">{footerData.location}</p>
                </motion.div>
            </motion.div>
        </footer>
    );
}
