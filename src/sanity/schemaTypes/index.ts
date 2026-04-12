import type { SchemaTypeDefinition } from 'sanity'
import { postType } from './documents/postType'
import { seoType } from './objects/seoType'
import { codeBlockType } from './objects/codeBlockType'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [postType, seoType, codeBlockType],
}
