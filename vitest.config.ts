import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: [
      'test/*.test.ts'
    ],
    exclude: [
      'test/browser/*'
    ],
    setupFiles: [
      'dotenv/config',
      './test/setup.ts'
    ]
  }
});