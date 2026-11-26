import { siteConfig } from "@/sanity/env";

/**
 * Shared JSON-LD builders, after the alignsd library: one place for the site's entity IDs
 * and one builder per node type, so every page links into the same graph
 * (Person → WebSite → pages) instead of hand-writing it.
 *
 * Every builder returns a plain node; wrap them with `graph()` and render with
 * `safeJsonLdStringify`.
 */

export const ids = {
    person: () => `${siteConfig.url}/#person`,
    website: () => `${siteConfig.url}/#website`,
    page: (path: string) => `${absolute(path)}/#webpage`,
    breadcrumb: (path: string) => `${absolute(path)}/#breadcrumb`,
} as const;

export const ref = (id: string) => ({ "@id": id });

/** `/about` → `https://arndvs.com/about`; the home page is the bare origin. */
export function absolute(path: string): string {
    if (/^https?:\/\//.test(path)) return path.replace(/\/$/, "");
    return path === "/" || path === ""
        ? siteConfig.url
        : `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function graph(...nodes: (Record<string, unknown> | null | undefined | false)[]) {
    return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}

export interface Crumb {
    name: string;
    path: string;
}

/** Home is added first automatically; pass the rest in order, ending with the page itself. */
export function breadcrumbList(path: string, crumbs: Crumb[]) {
    const all: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];
    return {
        "@type": "BreadcrumbList",
        "@id": ids.breadcrumb(path),
        itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: absolute(c.path),
        })),
    };
}

export function webPage(opts: {
    type?: string | string[];
    path: string;
    name: string;
    description: string;
    withBreadcrumb?: boolean;
    extra?: Record<string, unknown>;
}) {
    return {
        "@type": opts.type ?? "WebPage",
        "@id": ids.page(opts.path),
        url: absolute(opts.path),
        name: opts.name,
        description: opts.description,
        isPartOf: ref(ids.website()),
        ...(opts.withBreadcrumb === false ? {} : { breadcrumb: ref(ids.breadcrumb(opts.path)) }),
        ...opts.extra,
    };
}

export function itemList(items: { name: string; path: string; description?: string }[]) {
    return {
        "@type": "ItemList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            url: absolute(item.path),
            ...(item.description ? { description: item.description } : {}),
        })),
    };
}

export interface Faq {
    question: string;
    answer: string;
}

/** Google shows FAQ rich results only for a few site types now, but AI engines read FAQs directly. */
export function faqPage(path: string, faqs: Faq[]) {
    return {
        "@type": "FAQPage",
        "@id": `${absolute(path)}/#faq`,
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
    };
}

export function service(opts: {
    path: string;
    name: string;
    description: string;
    serviceType: string;
    areaServed?: string[];
}) {
    return {
        "@type": "Service",
        "@id": `${absolute(opts.path)}/#service`,
        name: opts.name,
        description: opts.description,
        serviceType: opts.serviceType,
        url: absolute(opts.path),
        provider: ref(ids.person()),
        areaServed: (opts.areaServed ?? ["San Diego, CA", "United States"]).map((name) => ({
            "@type": "Place",
            name,
        })),
    };
}

export function softwareApplication(opts: {
    path: string;
    name: string;
    description: string;
    applicationCategory?: string;
}) {
    return {
        "@type": "WebApplication",
        "@id": `${absolute(opts.path)}/#app`,
        name: opts.name,
        description: opts.description,
        url: absolute(opts.path),
        applicationCategory: opts.applicationCategory ?? "BusinessApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: ref(ids.person()),
        isPartOf: ref(ids.website()),
    };
}
