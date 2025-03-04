import { antfu } from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
    },
    rules: {
        'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
}, {
    files: ['**/*.json'],
    rules: {
        'jsonc/indent': ['warn', 2],
        // 'style/eol-last': ['warn', 'never'],
    },
})
