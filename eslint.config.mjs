// @ts-check
import eslint from '@eslint/js'
import prettier from 'eslint-plugin-prettier';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import globals from 'globals';

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
      '@typescript-eslint': tseslint
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      globals: {
        ...globals.es2015,
        ...globals.node
      },
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
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/explicit-member-accessibility': 'warn',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'no-var': 'error',
      'prefer-const': 'error'
    }
  },
  {
    files: ['tests/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      '@typescript-eslint': tseslint
    },
    languageOptions: {
      globals: {
        ...globals.es2015,
        ...globals.node,
        jest: true
      },
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
