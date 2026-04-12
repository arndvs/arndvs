import type { SanityImageSource } from '@sanity/image-url'

export type SanityImageWithAlt = SanityImageSource & { alt?: string }
