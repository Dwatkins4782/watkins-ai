import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

// Flat config (ESLint 9 + Next 16). Replaces the removed `next lint` command
// and the legacy .eslintrc.json. Run with `npm run lint`.
const eslintConfig = [
  {
    ignores: [
      'frontend/**',
      'backend/**',
      '.next/**',
      'node_modules/**',
      '**/dist/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'warn',
      // Next 16 introduced these as errors; this codebase predates them and the
      // bulk of the findings live in the inline-component landing page (page.tsx),
      // which is deferred pending a verified local refactor. Tracked as warnings
      // so they stay visible without blocking lint/deploy. See docs/AUDIT_FOLLOWUPS.md.
      '@next/next/no-html-link-for-pages': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default eslintConfig;
