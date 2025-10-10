import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function MainStreamMerchantPage() {
  return (
    <main className="min-h-screen pt-16">
      <section className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to projects
          </Link>
        </Button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-sm font-medium text-muted-foreground">
              Digital Transformation • Web Development • Marketing Automation
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-balance">MainStream Merchant Services</h1>
          <p className="text-xl text-muted-foreground">Regional Sales Manager & Web Technology Lead • 2013-2017</p>
        </div>

        <div className="mt-12 space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Led a comprehensive digital transformation for MainStream Merchant Services, a credit card processing
              company based in Alpharetta, GA (acquired by Global Payments Inc). Spearheaded a complete corporate
              rebranding initiative that included creating a new brand identity from scratch, tearing down and
              rebuilding the entire website, and implementing sophisticated marketing automation systems that
              transformed lead generation and sales operations.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">Role & Responsibilities</h3>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Led complete corporate rebranding project, creating new brand identity including logo, color palette,
                  typography, and brand guidelines
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Designed and built new corporate website from scratch, including complete tear down of existing site
                  and ground-up rebuild
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>Developed and implemented marketing automation systems using Infusionsoft</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>Designed and built online lead generation funnels with automated follow-up campaigns</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>Created automated round-robin lead distribution system for Account Executives</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Managed remote sales team across multiple states while maintaining consultative sales approach
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Website Redesign & Development</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Executed a complete website overhaul, tearing down the existing site and rebuilding from the ground up.
              The new website aligned with the refreshed brand identity and served as the foundation for integrated
              marketing automation and lead generation systems. This project marked my entry into web development,
              teaching myself HTML, CSS, JavaScript, and CMS platforms while delivering a production-ready corporate
              website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Corporate Rebranding & Brand Identity</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Created a comprehensive new brand identity for MainStream Merchant Services, including logo design, color
              palette selection, typography system, and brand guidelines. The rebranding effort modernized the company&apos;s
              visual presence and positioned it competitively in the merchant services industry. This work required
              balancing creative design with business strategy, ensuring the new brand resonated with target customers
              while differentiating from competitors.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Marketing Automation Implementation</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Built sophisticated Infusionsoft campaign sequences featuring multi-branch email funnels with conditional
              logic. The system intelligently paused main email sequences when prospects engaged with promotional
              content, ensuring relevant messaging without overwhelming leads.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Campaign Architecture</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Main Sequence with Promo Branches</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Hand-drawn concept showing how the main email sequence pauses when a prospect clicks into a
                  promotional sequence, then resumes after the promo completes.
                </p>
                <div className="rounded-lg border border-border overflow-hidden bg-white">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MainSequencewithPromos_zps5488f480-LkIDNK8OTIAdYYDpQwDhupmAbH52yn.webp"
                    alt="Hand-drawn sketch of main sequence with promo branches"
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Simple Sequence Flow</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Basic structure showing main sequence emails with promotional branches.
                </p>
                <div className="rounded-lg border border-border overflow-hidden bg-white">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xTQLQO1%20%281%29-UTb04CJMZaRyQm4qYZgQzCnyZEoRr2.png"
                    alt="Simple sequence flow diagram"
                    width={1200}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Detailed Campaign Builder Implementation</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Infusionsoft campaign showing the complete flow with click tracking, delay timers, tag management, and
                  sequence control logic.
                </p>
                <div className="rounded-lg border border-border overflow-hidden bg-white">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kd2jmdN%20%281%29-1mT6yZXU92pKEqf7hZ3ijfxMDOoecX.jpg"
                    alt="Detailed Infusionsoft campaign builder showing main sequence with promo logic"
                    width={1600}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Single Promo Sequence Detail</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Close-up of a single promotional sequence showing goal tracking, tag application, and sequence restart
                  logic.
                </p>
                <div className="rounded-lg border border-border overflow-hidden bg-white">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rvKyPoE%20%281%29-ywM9zEjMABjsuNc7r4mglnPRzQlPsj.png"
                    alt="Single promo sequence with goal tracking and tag management"
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Complete Multi-Promo Campaign</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Full campaign architecture with 4 promotional sequences, success/fail tracking, CTA completion goals,
                  and sophisticated tag-based flow control.
                </p>
                <div className="rounded-lg border border-border overflow-hidden bg-white">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OjCoTlA%20%281%29-CMspuErna9P176VpVCQK6PrJzTzPAR.png"
                    alt="Complete multi-promo campaign with 4 sequences and advanced logic"
                    width={1600}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Key Features</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold">Complete Website Rebuild</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ground-up website redesign and development, replacing legacy site with modern, responsive design
                  aligned with new brand identity.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold">Brand Identity Creation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Comprehensive rebranding including logo design, color palette, typography system, and brand guidelines
                  for consistent visual identity.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold">Conditional Sequence Logic</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tag-based system to pause main sequences when prospects engaged with promotional content, ensuring
                  relevant messaging without overwhelming leads.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold">Click Tracking & Goals</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Monitored link clicks and CTA completion to trigger appropriate follow-up sequences and measure
                  campaign effectiveness.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold">Automated Lead Distribution</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Round-robin system to distribute qualified leads to Account Executives, optimizing response times and
                  sales team efficiency.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold">Multi-Branch Campaigns</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Complex campaign architecture with multiple promotional branches, success/fail tracking, and automatic
                  sequence resumption.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Business Impact</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="text-3xl font-bold text-primary">Modernized</div>
                <div className="mt-2 text-sm font-medium">Brand Presence</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Complete digital transformation with new brand identity and website positioned company competitively
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="text-3xl font-bold text-primary">Improved</div>
                <div className="mt-2 text-sm font-medium">Lead Nurturing</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Significantly enhanced lead conversion rates through automated, personalized follow-up sequences
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="text-3xl font-bold text-primary">Streamlined</div>
                <div className="mt-2 text-sm font-medium">Operations</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Integrated sales and marketing technologies to optimize team efficiency and customer acquisition
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Technologies Used</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "HTML/CSS/JavaScript",
                "Web Development",
                "CMS Platforms",
                "Graphic Design",
                "Brand Identity",
                "Infusionsoft (Keap)",
                "Marketing Automation",
                "Campaign Builder",
                "Tag Management",
                "Lead Generation Funnels",
                "CRM Integration",
                "Email Marketing",
              ].map((tech) => (
                <span key={tech} className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-8">
            <h3 className="text-xl font-semibold">Early Technical Foundation</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              This role marked my transition from sales into technology. While managing West Coast sales operations, I
              taught myself web development and marketing automation, building the technical foundation that would later
              enable me to found RipeMetrics. The experience of combining business strategy with technical
              implementation became a defining characteristic of my career.
            </p>
          </div>

          <div className="flex gap-4">
            <Button asChild>
              <Link href="/projects">View all projects</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about">Learn more about my journey</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
