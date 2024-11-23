// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import 'eslint-config-prettier/recom'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    }
  },
  {
    ignores: ['node_modules/*', 'build', 'eslint.config.mjs'],
  }
)
