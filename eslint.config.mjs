import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import tseslint from 'typescript-eslint'

export default defineConfig(
  { ignores: ['**/node_modules/', '**/.next/', '**/next-env.d.ts', 'apps/api/src/generated/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    extends: [nextVitals],
    settings: { next: { rootDir: 'apps/web' } },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
)
