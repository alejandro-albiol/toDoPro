// @ts-check

import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    plugins: {
      ['@typescript-eslint']: tseslint.plugin,
    }
  },
  {
    ignores: [
      '**/node_modules/',
      '*.js',
      'build/',
      'eslint.config.mjs'
    ]
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.es2020,
        ...globals.node
      },

      parserOptions: {
        allowAutomaticSingleRunInference: true,
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    }
  },
  eslintPluginPrettierRecommended
)
