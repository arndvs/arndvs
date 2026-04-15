import {
    defineDocuments,
    defineLocations,
    type DocumentLocation,
    type PresentationPluginOptions,
} from "sanity/presentation";

const homeLocation = {
    title: "Home",
    href: "/",
} satisfies DocumentLocation;

export const resolve: PresentationPluginOptions["resolve"] = {
    mainDocuments: defineDocuments([
        {
            route: "/blog/:slug",
            filter: '_type == "post" && slug.current == $slug',
        },
    ]),
    locations: {
        post: defineLocations({
            select: {
                title: "title",
                slug: "slug.current",
            },
            resolve: (doc) => ({
                locations: [
                    {
                        title: doc?.title || "Untitled",
                        href: `/blog/${doc?.slug}`,
                    },
                    { title: "Blog", href: "/blog" },
                    homeLocation,
                ],
            }),
        }),
        changelogEntry: defineLocations({
            select: {
                title: "title",
            },
            resolve: (doc) => ({
                locations: [
                    { title: "Changelog", href: "/changelog" },
                    homeLocation,
                ],
            }),
        }),
    },
};
