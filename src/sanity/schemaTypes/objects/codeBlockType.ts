import { defineType, defineField } from 'sanity'

export const codeBlockType = defineType({
    name: 'codeBlock',
    title: 'Code Block',
    type: 'object',
    fields: [
        defineField({
            name: 'code',
            title: 'Code',
            type: 'text',
            rows: 10,
        }),
        defineField({
            name: 'language',
            title: 'Language',
            type: 'string',
            options: {
                list: [
                    { title: 'TypeScript', value: 'typescript' },
                    { title: 'JavaScript', value: 'javascript' },
                    { title: 'JSX/TSX', value: 'tsx' },
                    { title: 'HTML', value: 'html' },
                    { title: 'CSS', value: 'css' },
                    { title: 'JSON', value: 'json' },
                    { title: 'GROQ', value: 'groq' },
                    { title: 'Bash', value: 'bash' },
                    { title: 'Markdown', value: 'markdown' },
                    { title: 'YAML', value: 'yaml' },
                    { title: 'GraphQL', value: 'graphql' },
                    { title: 'SQL', value: 'sql' },
                    { title: 'Python', value: 'python' },
                    { title: 'Plain Text', value: 'text' },
                ],
            },
            initialValue: 'typescript',
        }),
        defineField({
            name: 'filename',
            title: 'Filename',
            type: 'string',
            description: 'Optional filename to display above the code block.',
        }),
    ],
    preview: {
        select: {
            language: 'language',
            filename: 'filename',
            code: 'code',
        },
        prepare({ language, filename, code }) {
            return {
                title: filename || `${language || 'code'} block`,
                subtitle: code ? `${code.substring(0, 60)}...` : '',
            }
        },
    },
})
