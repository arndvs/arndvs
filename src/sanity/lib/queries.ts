import { defineQuery } from 'next-sanity'

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    categories,
    "bodyCharCount": length(pt::text(body))
  }
`)

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    slug,
    author,
    publishedAt,
    excerpt,
    mainImage,
    body[] {
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    "bodyCharCount": length(pt::text(body)),
    categories,
    seo
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)][].slug.current
`)

export const CHANGELOG_QUERY = defineQuery(`
  *[_type == "changelogEntry"] | order(date desc) {
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
`)

export const CHANGELOG_LATEST_DATE_QUERY = defineQuery(`
  *[_type == "changelogEntry"] | order(date desc) [0].date
`)
