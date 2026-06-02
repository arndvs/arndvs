import type { LucideIcon } from "lucide-react";
import { Github, Linkedin, Mail } from "lucide-react";

export interface SocialLink {
    name: string;
    href: string;
    icon: LucideIcon;
    ariaLabel: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
    {
        name: "GitHub",
        href: "https://github.com/arndvs",
        icon: Github,
        ariaLabel: "Visit Aaron's GitHub profile",
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com/in/arndvs",
        icon: Linkedin,
        ariaLabel: "Visit Aaron's LinkedIn profile",
    },
    {
        name: "Email",
        href: "mailto:aaron@arndvs.com",
        icon: Mail,
        ariaLabel: "Email Aaron",
    },
];
