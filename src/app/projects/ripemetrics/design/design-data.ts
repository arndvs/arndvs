export interface FigmaEmbed {
    fileKey: string;
    fileName: string;
    nodeId: string;
    label: string;
}

export interface PhaseStat {
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
}

export interface DesignPhase {
    id: string;
    number: number;
    title: string;
    shortLabel: string;
    summary: string;
    description: string;
    stats: PhaseStat[];
    tags: string[];
    figmaEmbeds: FigmaEmbed[];
    highlights: string[];
}

export interface DesignHeroData {
    title: string;
    subtitle: string;
    description: string;
    role: string;
    timeline: string;
    stats: PhaseStat[];
    engineeringLink: string;
}

export interface DesignPageData {
    hero: DesignHeroData;
    phases: DesignPhase[];
}

export const designPageData: DesignPageData = {
    hero: {
        title: "RipeMetrics",
        subtitle: "Design Portfolio",
        description:
            "From brand creation and trademark registration through collaborative design sprints with a team of UX/UI interns to 180+ production-ready screens — the complete design story of an AI-powered customer growth platform.",
        role: "Founder & Product Designer",
        timeline: "2017–2025",
        stats: [
            { value: 4666, label: "Figma Frames" },
            { value: 6, label: "Figma Files" },
            { value: 12, label: "Design Interns" },
            { value: 9, label: "Design Phases" },
        ],
        engineeringLink: "/projects/ripemetrics",
    },
    phases: [
        {
            id: "brand",
            number: 1,
            title: "Brand Foundation",
            shortLabel: "Brand",
            summary:
                "Created the entire RipeMetrics brand identity from scratch — logo, color system, typography — and secured USPTO trademark registration.",
            description:
                "The RipeMetrics brand was built in Figma from zero. Eight logo variants were designed across light and dark backgrounds, each with careful spacing and proportion rules. The color system spans 5 brand colors (Orange #FF792A, Yellow #FFC107, Magenta #E0274A, Green #15A15F, Black #2A2C36) plus a full system palette with semantic naming for UI states. Typography was established with clear hierarchy and pairing rules. The brand was strong enough to earn USPTO Trademark #88266303 (Registration #5855789).",
            stats: [
                { value: 8, label: "Logo Variants" },
                { value: 43, label: "Color Nodes" },
                { value: 5, label: "Brand Colors" },
            ],
            tags: ["Logo Design", "Color System", "Typography", "Trademark"],
            figmaEmbeds: [
                {
                    fileKey: "vRMpX9zN2a5Z2rvEKwWIjq",
                    fileName: "RipeMetrics-Branding",
                    nodeId: "3367-17732",
                    label: "Logo Variants",
                },
                {
                    fileKey: "vRMpX9zN2a5Z2rvEKwWIjq",
                    fileName: "RipeMetrics-Branding",
                    nodeId: "3367-17749",
                    label: "Color System",
                },
            ],
            highlights: [
                "8 logo variants across light/dark with spacing rules",
                "5 brand colors + full system palette with semantic naming",
                "USPTO Trademark #88266303 (Reg #5855789)",
                "Color naming convention maps to CSS variables ($primary-dark, $danger-lightest)",
            ],
        },
        {
            id: "design-system",
            number: 2,
            title: "Design System & Components",
            shortLabel: "System",
            summary:
                "Built a 223-component Figma library with systematic naming, 75 color tokens, and 457 icon assets — the foundation for every screen in the product.",
            description:
                "The design system lived in Figma as a shared component library with strict naming conventions (colors/brand/brand orange/100%). It included 75 color tokens organized by role (brand, semantic, neutral), 457 icon assets in both solid and outline variants, and reusable UI components for forms, cards, tables, navigation, and data visualization. The email design system added its own 416-element color documentation and comprehensive typography references with 65 total children across 2 reference frames.",
            stats: [
                { value: 223, label: "Components" },
                { value: 75, label: "Color Tokens" },
                { value: 457, label: "Icon Assets" },
            ],
            tags: ["Component Library", "Design Tokens", "Icons", "Documentation"],
            figmaEmbeds: [
                {
                    fileKey: "xYYJaghzyoin3c7QB3D7kN",
                    fileName: "MU_Website",
                    nodeId: "0-1592",
                    label: "Component Library (223 components)",
                },
                {
                    fileKey: "H5Ch8JMTd405gKBQJYeDI7",
                    fileName: "RipeMetrics-Emails",
                    nodeId: "0-1028",
                    label: "Email Typography System",
                },
            ],
            highlights: [
                "Systematic naming: colors/brand/brand orange/100%",
                "457 icons in solid + outline variants",
                "416-element email color documentation",
                "Typography reference frames with full hierarchy",
                "Design tokens structured for direct CSS/Tailwind export",
            ],
        },
        {
            id: "design-sprints",
            number: 3,
            title: "Design Sprints & Team Collaboration",
            shortLabel: "Sprints",
            summary:
                "Ran collaborative design sprints with a team of UX/UI interns — 1,892 frames of divergent exploration converging into production navigation designs.",
            description:
                "The design sprint process ran across a massive 1,892-frame Figma canvas with named sections for each intern: Jillean, Omar, Jarrett, Yumie, Andrew, Jim, Chris, and Farrah. Each person explored different approaches to campaign management, marketing groups, demographics, and navigation. The sprint canvas included a 'FINAL NAVIGATION DESIGNS' consolidation section showing how divergent exploration was driven to convergent decisions. Additional sprint activities included Campaign Center variants (8+ by Omid), Marketing Groups explorations (6+ variants), and systematic dropdown and calendar component specifications.",
            stats: [
                { value: 1892, label: "Sprint Frames" },
                { value: 8, label: "Designers" },
                { value: 116, label: "BI Layout Frames" },
            ],
            tags: ["Design Sprints", "Team Direction", "Facilitation", "Convergence"],
            figmaEmbeds: [
                {
                    fileKey: "iU20QfMZAwTpel9Rp3c9BE",
                    fileName: "Design-Sprints",
                    nodeId: "0-1",
                    label: "Sprint Canvas (1,892 frames)",
                },
                {
                    fileKey: "iU20QfMZAwTpel9Rp3c9BE",
                    fileName: "Design-Sprints",
                    nodeId: "5746-54822",
                    label: "BI Layouts",
                },
            ],
            highlights: [
                "Named intern sections: Jillean, Omar, Jarrett, Yumie, Andrew, Jim, Chris, Farrah",
                "'FINAL NAVIGATION DESIGNS' consolidation from divergent exploration",
                "Campaign Center: 8+ variant explorations by Omid",
                "Marketing Groups: 6+ layout variants explored",
                "Systematic dropdown and calendar component specs",
            ],
        },
        {
            id: "product-ui",
            number: 4,
            title: "SaaS Product — Early to Production",
            shortLabel: "Product",
            summary:
                "Evolved from 190 early mockups through design sprints to 180 polished production screens spanning CRM, marketing, feedback, and AI recommendations.",
            description:
                "The product UI evolved across multiple Figma files — from early 1440×1024px mockups exploring dashboard layouts, customer profiles, and messaging to polished final compositions ready for React implementation. The production screens cover the full SaaS platform: Customer Profile (16 screens with a 6-step call transfer flow), Marketing Platform (12+ variants), Communication Center (5+ screens with 3-panel messaging), Feedback Management (8 screens), Multi-Operation Analytics (6 screens), AI Recommendation dashboards, Reports (up to 17,094px tall data-dense pages), Prospect Management pipeline, and Contact/Employee management.",
            stats: [
                { value: 190, label: "Early Mockups" },
                { value: 104, label: "Final Compositions" },
                { value: 76, label: "Final Compositions v2" },
            ],
            tags: ["SaaS", "Dashboard", "CRM", "Data Visualization", "Enterprise"],
            figmaEmbeds: [
                {
                    fileKey: "5h4noyctjBiOkmWvSZUnol",
                    fileName: "Software---Front-End",
                    nodeId: "4973-0",
                    label: "Final Compositions (104 screens)",
                },
                {
                    fileKey: "5h4noyctjBiOkmWvSZUnol",
                    fileName: "Software---Front-End",
                    nodeId: "12777-62540",
                    label: "Final Compositions v2 (76 screens)",
                },
                {
                    fileKey: "ljzEtmlOOCy2pEclw26Hwy",
                    fileName: "RM-Early-Mockups",
                    nodeId: "0-1",
                    label: "Early Mockups — Dashboard",
                },
            ],
            highlights: [
                "Customer Profile: 16 screens with 6-step call transfer flow",
                "Marketing Platform: 12+ variants with campaign builder",
                "Communication Center: 3-panel messaging interface",
                "AI Recommendation dashboards with intelligent suggestions",
                "Reports up to 17,094px tall — data-dense enterprise analytics",
                "Prospect Management pipeline with stage progression",
            ],
        },
        {
            id: "mobile",
            number: 5,
            title: "Mobile App Design",
            shortLabel: "Mobile",
            summary:
                "Designed a full mobile CRM across 6 modules — native-style mobile UI with its own component system, not just responsive web.",
            description:
                "The mobile app was designed as a standalone native-style experience, not a responsive adaptation of the desktop UI. Six modules cover the core mobile CRM workflow: Login & Home (onboarding + dashboard), Messenger (real-time customer communication), Customer Profile (mobile-optimized detail views), Component Library (reusable mobile patterns), Loyalty (customer reward tracking), and Navigation (tab bar + drawer patterns). Each module has its own component specifications and interaction patterns optimized for touch.",
            stats: [{ value: 6, label: "Mobile Modules" }],
            tags: ["Mobile", "Native UI", "CRM", "Component Library"],
            figmaEmbeds: [
                {
                    fileKey: "5h4noyctjBiOkmWvSZUnol",
                    fileName: "Software---Front-End",
                    nodeId: "14722-79171",
                    label: "Mobile Login & Home",
                },
                {
                    fileKey: "5h4noyctjBiOkmWvSZUnol",
                    fileName: "Software---Front-End",
                    nodeId: "9390-62549",
                    label: "Mobile Messenger",
                },
            ],
            highlights: [
                "Login & Home: onboarding flow + mobile dashboard",
                "Messenger: real-time customer communication UI",
                "Customer Profile: mobile-optimized detail views",
                "Dedicated mobile component library",
                "Tab bar + drawer navigation patterns",
            ],
        },
        {
            id: "email",
            number: 6,
            title: "Email Design & Data Reporting",
            shortLabel: "Email",
            summary:
                "990-element email design system with responsive desktop+mobile pairs, 5 iterative revision rounds, and data-dense automated report templates.",
            description:
                "The email system was designed for a platform sending 10,000+ daily emails. Templates include Desktop Negative Report (768×1169px), Desktop Weekly Report (768×1566px), and their mobile counterparts (320px wide). A comprehensive Monthly Report template spans 1024×4449px with embedded dashboard visualizations. The design file also includes 5 iterative revision rounds on feedback emails showing the refinement process, a Liquid Ratings template, and full typography and color documentation for email-specific design tokens. Embedded dashboard screens within the email file cover Store Stats, Customer-Coupons, Overall Rating, Top Brands, Demographics, NPS Breakdown, and Popular Times.",
            stats: [
                { value: 990, label: "Email Elements" },
                { value: 5, label: "Revision Rounds" },
                { value: 416, label: "Color Tokens Documented" },
            ],
            tags: ["Email Design", "Responsive", "Data Reports", "Typography"],
            figmaEmbeds: [
                {
                    fileKey: "H5Ch8JMTd405gKBQJYeDI7",
                    fileName: "RipeMetrics-Emails",
                    nodeId: "0-1",
                    label: "Email Templates (990 elements)",
                },
            ],
            highlights: [
                "Desktop + mobile responsive pairs (768px → 320px)",
                "Monthly Report: 1024×4449px data-dense template",
                "5 iterative revision rounds documented in Figma",
                "Embedded dashboard screens: NPS, Demographics, Store Stats",
                "10,000+ daily email platform with SendGrid integration",
            ],
        },
        {
            id: "marketing",
            number: 7,
            title: "Marketing Website & Funnels",
            shortLabel: "Marketing",
            summary:
                "15+ landing pages from awareness through conversion to retention, with 4 homepage iterations showing collaborative design evolution.",
            description:
                "The marketing website spanned 31 Figma pages with ~500 frames covering the full acquisition funnel. Four homepage iterations (A01 → New Order → CURRENT → Morgan) demonstrate collaborative design evolution with the UX/UI interns. 15+ landing pages target different funnel stages: awareness (Forbes LP, industry survey, cannabis CX report), consideration (feature-specific pages, cause marketing), and conversion (CX Guide download, dispensary landing, loyalty program). The site includes blog templates, about page, sales page, and a comprehensive design for the email-based data reporting interface.",
            stats: [
                { value: 31, label: "Figma Pages" },
                { value: 500, label: "Frames", prefix: "~" },
                { value: 15, label: "Landing Pages", prefix: "+" },
            ],
            tags: ["Marketing", "Landing Pages", "Funnels", "CRO"],
            figmaEmbeds: [
                {
                    fileKey: "xYYJaghzyoin3c7QB3D7kN",
                    fileName: "MU_Website",
                    nodeId: "0-1",
                    label: "Homepage (CURRENT iteration)",
                },
                {
                    fileKey: "xYYJaghzyoin3c7QB3D7kN",
                    fileName: "MU_Website",
                    nodeId: "1148-0",
                    label: "Landing Pages (44 frames)",
                },
            ],
            highlights: [
                "4 homepage iterations: A01 → New Order → CURRENT → Morgan",
                "Forbes LP, industry survey, CX report — awareness stage",
                "CX Guide download, dispensary landing — conversion stage",
                "Loyalty program and email reporting — retention stage",
                "Blog, about, sales page — full site design",
            ],
        },
        {
            id: "data-viz",
            number: 8,
            title: "Data Visualization & BI",
            shortLabel: "Data Viz",
            summary:
                "Dedicated NPS charts, BI dashboards, and systematic chart color testing — proving rigorous approach to accessible data visualization.",
            description:
                "Data visualization was treated as its own design discipline across dedicated Figma pages. The NPS Charts page (71 frames) explores Net Promoter Score visualizations with multiple chart types and layouts. The BI Layouts page (116 frames) contains business intelligence dashboard compositions with Performance Dashboard, Customer Insights, Shopping Analytics, and Marketing Campaign views. A dedicated Chart Color Testing page (36 frames) documents the systematic process of choosing accessible, visually distinct color palettes for multi-series data — testing combinations against colorblind accessibility standards.",
            stats: [
                { value: 71, label: "NPS Chart Frames" },
                { value: 116, label: "BI Layout Frames" },
                { value: 36, label: "Color Test Frames" },
            ],
            tags: ["Data Visualization", "NPS", "Business Intelligence", "Accessibility"],
            figmaEmbeds: [
                {
                    fileKey: "5h4noyctjBiOkmWvSZUnol",
                    fileName: "Software---Front-End",
                    nodeId: "1418-5985",
                    label: "NPS Charts (71 frames)",
                },
                {
                    fileKey: "iU20QfMZAwTpel9Rp3c9BE",
                    fileName: "Design-Sprints",
                    nodeId: "1006-0",
                    label: "Chart Color Testing (36 frames)",
                },
            ],
            highlights: [
                "NPS visualizations: multiple chart types and layouts",
                "BI dashboards: Performance, Customer Insights, Shopping, Marketing",
                "Systematic color palette testing for multi-series data",
                "Colorblind accessibility validation",
                "40+ custom charts implemented with Highcharts",
            ],
        },
        {
            id: "dev-handoff",
            number: 9,
            title: "Dev Handoff & Delivery",
            shortLabel: "Handoff",
            summary:
                "116 implementation-ready frames with Page Bar components, measurement specs, and design token naming that maps directly to CSS/Tailwind variables.",
            description:
                "The dev handoff process bridged Figma design to React implementation. The Develop page contains 116 frames with implementation-ready specifications: NPS Measures (3 variants), Performance Dashboard, Customer Insights, Shopping Analytics, Marketing Campaign views, Communication Center, and Product Summary (3 variants). Reusable Page Bar components were built as systematic patterns. Design token naming ($primary-dark, $danger-lightest) was structured to map directly to CSS/Tailwind variables, eliminating translation errors between design and code. As the founder who designed the product from the ground up and built it in React, the handoff was seamless — no designer-developer communication gaps.",
            stats: [
                { value: 116, label: "Dev-Ready Frames" },
                { value: 37, label: "Component Specs" },
            ],
            tags: ["Dev Handoff", "Design Tokens", "Implementation", "Design-to-Code"],
            figmaEmbeds: [
                {
                    fileKey: "5h4noyctjBiOkmWvSZUnol",
                    fileName: "Software---Front-End",
                    nodeId: "5746-54822",
                    label: "Develop (Dev Handoff)",
                },
            ],
            highlights: [
                "Page Bar components as reusable implementation patterns",
                "Design token naming maps to CSS/Tailwind: $primary-dark → var(--primary-dark)",
                "NPS Measures: 3 implementation variants",
                "Founder designed in Figma and built in React — zero translation loss",
                "Performance Dashboard, Customer Insights, Shopping Analytics specs",
            ],
        },
    ],
};
