import { apiVersion, dataset, projectId, siteConfig } from './src/sanity/env'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
    name: 'default',
    title: 'arndvs Studio',

    basePath: '/studio',
    projectId,
    dataset,

    schema,

    plugins: [
        structureTool({ structure }),

        presentationTool({
            previewUrl: {
                origin: siteConfig.url,
                preview: '/',
                previewMode: {
                    enable: '/api/draft-mode/enable',
                },
            },
        }),

        visionTool({ defaultApiVersion: apiVersion }),
    ],
})
