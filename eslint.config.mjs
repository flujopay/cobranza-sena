import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**', '**/build/**'],
  },

  ...tseslint.configs.recommended,

  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@next/next': { rules: {} },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-duplicate-enum-values': 'off',

      '@next/next/no-img-element': 'off',
      'react-hooks/exhaustive-deps': 'off',

      'no-console': 'warn',
    },
  },
])
