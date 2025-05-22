import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    setupFiles: ['./test/setup.ts']
  },
});