// @ts-check
import eslint from '@eslint/js';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.js',
      '**/eslint.config.mjs'
    ]
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...prettier.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'no-debugger': 'error',
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }]
    }
  },
  {
    files: ['tests/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      '@typescript-eslint': tseslint
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  }
];