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
      './test/setup.ts'
    ]
  }
});