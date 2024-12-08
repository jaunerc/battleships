import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.node } },
    { ignores: ['dist/*'] },
    { plugins: { '@stylistic': stylistic } },
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        braceStyle: '1tbs',
    }),
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
]
