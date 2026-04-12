import { BookText } from 'lucide-react'
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
        ])
