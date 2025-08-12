module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
  ],
  env: {
    node: true,
    es2022: true,
  },
  globals: {
    globalThis: 'readonly',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
  ignorePatterns: ['dist/', 'node_modules/', '**/*.test.ts', '**/*.spec.ts'],
};