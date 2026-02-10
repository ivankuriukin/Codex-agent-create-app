import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    const alias = [
      { find: '@app', replacement: path.join(dirname, '../src/app') },
      {
        find: '@processes',
        replacement: path.join(dirname, '../src/processes'),
      },
      { find: '@pages', replacement: path.join(dirname, '../src/pages') },
      { find: '@widgets', replacement: path.join(dirname, '../src/widgets') },
      { find: '@features', replacement: path.join(dirname, '../src/features') },
      { find: '@entities', replacement: path.join(dirname, '../src/entities') },
      { find: '@shared', replacement: path.join(dirname, '../src/shared') },
      { find: '@ui', replacement: path.join(dirname, '../src/shared/ui') },
      { find: '@lib', replacement: path.join(dirname, '../src/shared/lib') },
      {
        find: '@config',
        replacement: path.join(dirname, '../src/shared/config'),
      },
      { find: '@api', replacement: path.join(dirname, '../src/shared/api') },
    ];

    config.resolve = config.resolve ?? {};
    config.resolve.alias = [
      ...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
      ...alias,
    ];

    return config;
  },
};
export default config;
