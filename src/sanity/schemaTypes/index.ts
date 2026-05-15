import type { SchemaTypeDefinition } from "sanity";

import { changelogEntryType } from "./documents/changelogEntryType";
import { dailyDigestType } from "./documents/dailyDigestType";
import { postType } from "./documents/postType";
import { projectType } from "./documents/projectType";
import { socialDraftType } from "./documents/socialDraftType";
import { weeklyDigestType } from "./documents/weeklyDigestType";
import { codeBlockType } from "./objects/codeBlockType";
import { seoType } from "./objects/seoType";

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [
        postType,
        changelogEntryType,
        weeklyDigestType,
        dailyDigestType,
        socialDraftType,
        projectType,
        seoType,
        codeBlockType,
    ],
};
