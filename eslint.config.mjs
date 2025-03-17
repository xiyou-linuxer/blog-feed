import { antfu } from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
    },
    rules: {
        'jsonc/indent': ['warn', 2],
        'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
}, {
    files: ['**/*.json'],
    rules: {
        'style/eol-last': ['warn', 'never'],
    },
})
