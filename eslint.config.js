import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  {
    ignores: ['dist', 'dist-ssr', 'node_modules', 'handoff', 'media-src', 'public', 'src/generated', 'server/knowledge.generated.js', '.verify', 'test-results', 'playwright-report', 'docs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.ts'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['api/**/*.js', 'server/**/*.js', 'scripts/**/*.mjs', '*.config.{js,ts}', 'vite.config.ts', 'playwright.config.ts'],
    languageOptions: { globals: { ...globals.node } },
  },
)
