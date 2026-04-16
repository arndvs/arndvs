import { defineQuery } from "next-sanity";

// ——————————————————————————————————————————————
// Layer 1 — Atomic fragments
// ——————————————————————————————————————————————

/** Resolves image asset with dimensions + LQIP, plus hotspot/crop for urlFor */
const imageAssetFragment = /* groq */ `
  asset->{ _id, url, metadata { dimensions, lqip } },
  hotspot,
  crop
`;

// ——————————————————————————————————————————————
// Layer 4 — Page-level queries
// ——————————————————————————————————————————————

export const POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage {
      ${imageAssetFragment},
      alt
    },
    categories,
    "bodyCharCount": length(pt::text(body))
  }
`);

export const POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    excerpt,
    tldr,
    mainImage {
      ${imageAssetFragment},
      alt
    },
    body[] {
      ...,
      _type == "inlineImage" => {
        ...,
        ${imageAssetFragment}
      }
    },
    "bodyCharCount": length(pt::text(body)),
    categories,
    seo {
      metaTitle,
      metaDescription,
      focusKeyword,
      keywords,
      noIndex,
      image {
        asset->{ _id, url, metadata { dimensions } },
        hotspot,
        crop
      }
    }
  }
`);

export const POST_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)][].slug.current
`);

export const SITEMAP_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`);

export const CHANGELOG_QUERY = defineQuery(/* groq */ `
  *[_type == "changelogEntry"] | order(date desc) [0...50] {
    _id,
    title,
    "slug": slug.current,
    date,
    type,
    summary,
    body,
    relatedProject,
    commitHash,
    commitRange,
    isHighlight,
    source
  }
`);

export const CHANGELOG_LATEST_DATE_QUERY = defineQuery(/* groq */ `
  *[_type == "changelogEntry"] | order(date desc) [0].date
`);

export const ENHANCE_POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && _id == $id][0] {
    _id,
    title,
    excerpt,
    "bodyText": pt::text(body),
    categories
  }
`);
