// @ts-check
import eslint from '@eslint/js'
import prettier from 'eslint-plugin-prettier';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '**/*.js',
      'eslint.config.mjs'
    ]
  },
  {
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended
    ],
    languageOptions: {
      globals: {
        ...globals.es2015,
        ...globals.node
      },
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    rules: {
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
      'prefer-const': 'error',
      'prettier/prettier': 'error'
    }
  }
];
