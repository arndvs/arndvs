"use client"

import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { ContactForm } from "./contact-form"
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants"
const footerData = {
  brand: {
    name: "Aaron Davis",
    description:
      "Full-stack engineer building AI systems that work in production.",
  },
  navigation: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
  ],
  social: [
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
  ],
  location: "San Diego, California",
}
export function Footer() {
  const currentYear = new Date().getFullYear()
  const { containerVariants, itemVariants } = useAnimationVariants()

  return (
    <footer className="bg-background">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-12 lg:px-8"
      >
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">{footerData.brand.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{footerData.brand.description}</p>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <nav className="flex flex-col gap-2 text-sm" aria-label="Footer navigation">
              {footerData.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Connect */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex gap-4" role="list" aria-label="Social media links">
              {footerData.social.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label={social.ariaLabel}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
              <ContactForm
                triggerVariant="outline"
                triggerSize="icon"
                triggerClassName="h-10 w-10"
                triggerIcon={<Mail className="h-5 w-5" />}
                triggerText=""
                showIcon={false}
              />
            </div>
            <p className="text-sm text-muted-foreground">{footerData.location}</p>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 text-center text-sm text-muted-foreground"
        >
          <p>
            © {currentYear} {footerData.brand.name}. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  )
}

