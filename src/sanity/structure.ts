import { BookText, History } from 'lucide-react'
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
    S.list()
        .title('Content')
        .items([
            S.listItem()
                .title('Blog')
                .icon(BookText)
                .child(
                    S.documentTypeList('post')
                        .title('Posts')
                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
            S.listItem()
                .title('Changelog')
                .icon(History)
                .child(
                    S.documentTypeList('changelogEntry')
                        .title('Changelog Entries')
                        .defaultOrdering([{ field: 'date', direction: 'desc' }])
                ),
        ])
