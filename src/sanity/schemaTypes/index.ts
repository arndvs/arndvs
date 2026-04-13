import type { SchemaTypeDefinition } from "sanity";

import { changelogEntryType } from "./documents/changelogEntryType";
import { postType } from "./documents/postType";
import { codeBlockType } from "./objects/codeBlockType";
import { seoType } from "./objects/seoType";

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [postType, changelogEntryType, seoType, codeBlockType],
};
