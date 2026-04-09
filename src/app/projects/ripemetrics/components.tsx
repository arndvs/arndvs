"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  containerVariants,
  itemVariants,
  cardVariants,
  staggerContainerVariants,
} from "@/lib/utils/animations"
import type {
  HeaderData,
  OverviewData,
  Feature,
  ImpactMetric,
  TechSection,
  Achievement,
  ConclusionData,
} from "./data"

export function BackButton() {
  return (
    <Button asChild variant="ghost" size="sm" className="mb-8">
      <Link href="/projects">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to projects
      </Link>
    </Button>
  )
}

export function HeaderSection({ data }: { data: HeaderData }) {
  const badgeColor: Record<string, string> = {
    cyan: "bg-cyan-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="border-b border-border"
    >
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <motion.div variants={itemVariants}>
          <BackButton />
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
          <div className={`h-2 w-2 rounded-full ${badgeColor[data.badge.color] ?? "bg-green-500"}`} />
          <span className="text-sm font-medium text-muted-foreground">{data.badge.label}</span>
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-5xl font-bold tracking-tight text-balance">
          {data.title}
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty">
          {data.description}
        </motion.p>
      </div>
    </motion.section>
  )
}

export function OverviewSection({ data }: { data: OverviewData }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
    >
      <div className="grid gap-12 lg:grid-cols-3">
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {data.role.label}
          </h3>
          <p className="mt-2 text-lg">{data.role.value}</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {data.timeline.label}
          </h3>
          <p className="mt-2 text-lg">{data.timeline.value}</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {data.technologies.label}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.technologies.items.map((tech) => (
              <motion.span
                key={tech}
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="rounded-md bg-secondary px-2 py-1 text-sm font-medium"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export function ChallengeSection({ title, description }: { title: string; description: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
        {title}
      </motion.h2>
      <motion.p variants={itemVariants} className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {description}
      </motion.p>
    </motion.section>
  )
}

export function SolutionSection({
  title,
  description,
  features,
}: {
  title: string
  description: string
  features: Feature[]
}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
        {title}
      </motion.h2>
      <motion.p variants={itemVariants} className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {description}
      </motion.p>
      <motion.div variants={staggerContainerVariants} className="mt-12 grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <motion.div key={feature.id} variants={cardVariants}>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export function ImpactSection({ title, metrics }: { title: string; metrics: ImpactMetric[] }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
        {title}
      </motion.h2>
      <motion.div variants={staggerContainerVariants} className="mt-12 grid gap-8 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <motion.div key={index} variants={cardVariants} className="rounded-lg border border-border bg-card p-6">
            <div className="text-4xl font-bold text-primary">{metric.value}</div>
            <div className="mt-2 text-sm font-medium text-muted-foreground">{metric.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export function TechImplementationSection({
  title,
  sections,
}: {
  title: string
  sections: TechSection[]
}) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
        {title}
      </motion.h2>
      <motion.div variants={itemVariants} className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
        {sections.map((section, index) => (
          <p key={index}>
            <strong>{section.heading}:</strong> {section.content}
          </p>
        ))}
      </motion.div>
    </motion.section>
  )
}

export function AchievementsSection({ title, items }: { title: string; items: Achievement[] }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
        {title}
      </motion.h2>
      <motion.div variants={staggerContainerVariants} className="mt-8 space-y-4">
        {items.map((achievement, index) => (
          <motion.div key={index} variants={cardVariants} className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-xl font-semibold">{achievement.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{achievement.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export function ConclusionSection({ data }: { data: ConclusionData }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
    >
      <motion.div variants={itemVariants} className="rounded-lg border border-border bg-card p-8 lg:p-12">
        <h2 className="text-3xl font-bold tracking-tight">{data.title}</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{data.description}</p>
        <div className="mt-8">
          <Button asChild variant="outline" size="lg">
            <Link href={data.cta.secondary.href}>{data.cta.secondary.text}</Link>
          </Button>
        </div>
      </motion.div>
    </motion.section>
  )
}
