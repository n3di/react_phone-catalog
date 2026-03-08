// .eslintrc.cjs — ESLint 8 + TS-ESLint 8 + React 18 + Vite
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'], // type-aware tylko dla src/
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'simple-import-sort',
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // reguły wymagające type-info (dla plików z project)
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  settings: { react: { version: 'detect' } },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    // jeśli chcesz lindować Cypress – nie wykluczaj katalogu
  ],
  rules: {
    // Importy / kolejność
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // Ogólne
    'prefer-const': 'error',
    curly: ['error', 'all'],
    'no-redeclare': ['error', { builtinGlobals: true }],
    'no-console': 'error',
    'brace-style': ['error', '1tbs'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
    ],
    // NAJWAŻNIEJSZA ZMIANA: używaj core’owej reguły 'semi', nie TS-owej:
    semi: ['error', 'always'],

    // React
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'react/destructuring-assignment': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/state-in-constructor': ['error', 'never'],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // a11y
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    // UWAGA: nie używamy przestarzałego 'label-has-for'

    // TypeScript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/ban-types': 'off',

    // Prettier jako lint
    'prettier/prettier': 'warn',
  },

  overrides: [
    // 1) CYPRUS + KONFIGI: poluzuj zasady i pozwól na require/namespace
    // Cypress
    {
      files: ['cypress/**/*.{js,ts,tsx}', 'cypress.config.*'],
      extends: ['plugin:cypress/recommended'],
      env: { 'cypress/globals': true, node: true, browser: false },
      parserOptions: {
        project: ['./tsconfig.cypress.json'],
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-namespace': 'off',

        // luz dla plików testowych/narzędziowych:
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
      },
    },

    // Konfigi narzędzi (Vite itd.)
    {
      files: [
        'vite.config.*',
        '*.config.{js,cjs,ts,mts}',
        '**/*.config.{js,cjs,ts,mts}',
      ],
      env: { node: true },
      parserOptions: {
        project: ['./tsconfig.tools.json'],
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
      },
    },

    // 2) API/ADAPTERY: jeśli masz legacy „any”, nie blokuj builda
    {
      files: ['src/**/api/**/*.{ts,tsx}', 'src/**/model/**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
      },
    },

    // 3) Testy: nie czepiaj się console i floating promises
    {
      files: ['**/*.spec.{js,jsx,ts,tsx}'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },

    // 4) Pliki deklaracji / d.ts – pozwól na namespace
    {
      files: ['**/*.d.ts', 'src/**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-namespace': 'off',
      },
    },
  ],
};
