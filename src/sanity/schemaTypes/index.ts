import type { SchemaTypeDefinition } from 'sanity'
import { postType } from './documents/postType'
import { changelogEntryType } from './documents/changelogEntryType'
import { seoType } from './objects/seoType'
import { codeBlockType } from './objects/codeBlockType'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [postType, changelogEntryType, seoType, codeBlockType],
}
