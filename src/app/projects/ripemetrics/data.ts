export interface HeaderData {
  backLink: string
  backText: string
  badge: { color: string; label: string }
  title: string
  description: string
}

export interface OverviewData {
  role: { label: string; value: string }
  timeline: { label: string; value: string }
  technologies: { label: string; items: string[] }
}

export interface Feature {
  id: string
  title: string
  description: string
}

export interface ImpactMetric {
  value: string
  label: string
}

export interface TechSection {
  heading: string
  content: string
}

export interface Achievement {
  title: string
  description: string
}

export interface ConclusionData {
  title: string
  description: string
  cta: { secondary: { text: string; href: string } }
}

export interface PageData {
  header: HeaderData
  overview: OverviewData
  challenge: { title: string; description: string }
  solution: { title: string; description: string; features: Feature[] }
  impact: { title: string; metrics: ImpactMetric[] }
  technicalImplementation: { title: string; sections: TechSection[] }
  achievements: { title: string; items: Achievement[] }
  conclusion: ConclusionData
}

export const pageData: PageData = {
  header: {
    backLink: "/projects",
    backText: "Back to projects",
    badge: {
      color: "green",
      label: "AI / SaaS Platform",
    },
    title: "RipeMetrics",
    description:
      "AI-native customer growth platform that helps businesses automate customer service, reduce costs by 40%, and scale support operations through intelligent chatbots, predictive analytics, and omni-channel communication.",
  },
  overview: {
    role: {
      label: "Role",
      value: "Founder, President & Full Stack Developer",
    },
    timeline: {
      label: "Timeline",
      value: "April 2017 - July 2025",
    },
    technologies: {
      label: "Technologies",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Redux RTK",
        "Material UI",
        "Tailwind",
        "FastAPI",
        "PostgreSQL",
        "MySQL",
        "OpenAI",
        "Pinecone",
        "Chroma",
      ],
    },
  },
  challenge: {
    title: "The Challenge",
    description:
      "Businesses struggle to scale customer service operations efficiently. Traditional support systems are costly, slow to respond, and can't handle the volume of customer interactions modern businesses face. Companies need intelligent automation that maintains service quality while reducing operational costs.",
  },
  solution: {
    title: "The Solution",
    description:
      "RipeMetrics is an AI-native customer growth platform that processes thousands of customer interactions daily across 50+ enterprise clients. The platform combines context-aware chatbots, vector database search, and real-time analytics to deliver intelligent, automated customer service at scale.",
    features: [
      {
        id: "chatbots",
        title: "AI-Powered Chatbots",
        description:
          "Context-aware chatbots built with OpenAI, MySQL, and Pinecone/Chroma vector databases for omni-channel AI customer service with intelligent response generation.",
      },
      {
        id: "analytics",
        title: "Real-Time Analytics Dashboard",
        description:
          "Comprehensive analytics with 40+ custom charts using Highcharts for large dataset visualization, providing actionable insights into customer interactions and service performance.",
      },
      {
        id: "extraction",
        title: "Automated Content Extraction",
        description:
          "Modular website content extraction system using TypeScript and Apify SDK, reducing client onboarding time from 20 minutes to just 2 minutes.",
      },
      {
        id: "call-center",
        title: "Real-Time Call Center",
        description:
          "Web-based call center with ElevenLabs voice synthesis and Twilio integration for IVR system, enabling voice-based customer interactions with AI assistance.",
      },
    ],
  },
  impact: {
    title: "Impact",
    metrics: [
      { value: "50+", label: "Enterprise clients served" },
      { value: "40%", label: "Reduction in customer service costs" },
      { value: "95%+", label: "System uptime achieved" },
    ],
  },
  technicalImplementation: {
    title: "Technical Implementation",
    sections: [
      {
        heading: "Frontend Architecture",
        content:
          "Led complete refactor from Laravel Livewire to React/Next.js using RTK Query, TypeScript, TailwindCSS, and Material UI, reducing network request response times by 6 seconds on average. Built the main SaaS application and marketing website with headless CMS integration using Sanity. Created lightweight Preact islands architecture for embeddable widgets and WordPress plugin integration.",
      },
      {
        heading: "AI & Machine Learning",
        content:
          "Designed context-aware chatbot using OpenAI, MySQL, and Pinecone/Chroma vector databases for omni-channel AI customer service. Implemented Next.js/FastAPI system for AI interactions with streaming response capabilities. Architected vector databases for document embeddings with multi-tenant architecture.",
      },
      {
        heading: "Backend & Infrastructure",
        content:
          "Built real-time communication systems using PusherJS and WebSockets. Monitored and maintained CI/CD pipelines through Forge, Vercel, Bitbucket, and DigitalOcean. Implemented PostHog analytics to monitor onboarding processes and optimize user flow conversion rates. Configured SendGrid SDK for marketing email server supporting 10,000+ daily emails with TCR/10DLC compliance.",
      },
    ],
  },
  achievements: {
    title: "Key Technical Achievements",
    items: [
      {
        title: "Performance Optimization",
        description:
          "Reduced network request response times by 6 seconds on average through complete React/Next.js refactor with RTK Query and TypeScript.",
      },
      {
        title: "Rapid Client Onboarding",
        description:
          "Built automated content extraction system that reduced client onboarding time from 20 minutes to 2 minutes using TypeScript and Apify SDK.",
      },
      {
        title: "Comprehensive Analytics",
        description:
          "Developed analytics dashboard with 40+ custom charts using Highcharts for large dataset visualization and real-time insights.",
      },
      {
        title: "High Availability",
        description:
          "Achieved 95%+ system uptime through robust architecture, comprehensive monitoring with Sentry and PostHog, and efficient CI/CD pipelines.",
      },
      {
        title: "Scalable Email Infrastructure",
        description:
          "Configured SendGrid SDK to support 10,000+ daily marketing emails with TCR/10DLC compliance for enterprise-scale communication.",
      },
      {
        title: "Multi-Tenant Vector Database",
        description:
          "Architected vector databases for document embeddings with multi-tenant architecture using Pinecone and Chroma for intelligent search.",
      },
    ],
  },
  conclusion: {
    title: "Results",
    description:
      "RipeMetrics successfully scaled from concept to serving 50+ enterprise clients, processing thousands of customer interactions daily. The platform reduced customer service costs by 40% through AI automation while maintaining 95%+ system uptime. Led technical team through multiple successful product pivots based on market feedback, demonstrating the platform's adaptability and robust architecture.",
    cta: {
      secondary: { text: "View More Projects", href: "/projects" },
    },
  },
}
