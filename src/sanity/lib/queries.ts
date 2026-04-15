import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage {
      ...,
      asset-> { _id, url, metadata { dimensions, lqip } }
    },
    categories,
    "bodyCharCount": length(pt::text(body))
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    slug,
    author,
    publishedAt,
    excerpt,
    tldr,
    mainImage {
      ...,
      asset-> { _id, url, metadata { dimensions, lqip } }
    },
    body[] {
      ...,
      _type == "image" => {
        ...,
        asset-> { _id, url, metadata { dimensions, lqip } }
      }
    },
    "bodyCharCount": length(pt::text(body)),
    categories,
    seo {
      ...,
      image { ..., asset-> { _id, url, metadata { dimensions } } }
    }
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)][].slug.current
`);

export const SITEMAP_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`);

export const CHANGELOG_QUERY = defineQuery(`
  *[_type == "changelogEntry"] | order(date desc) [0...50] {
    _id,
    title,
    slug,
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

export const CHANGELOG_LATEST_DATE_QUERY = defineQuery(`
  *[_type == "changelogEntry"] | order(date desc) [0].date
`);
