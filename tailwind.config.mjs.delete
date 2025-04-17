/** @type {import('tailwindcss').Config} */
import coreDataConfig from '@performant-software/core-data/tailwind.config';
import typeography from '@tailwindcss/typography';

export default {
	presets: [
		coreDataConfig
	],
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/@performant-software/core-data/**/*.{js,jsx,ts,tsx}'
	],
	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				'primary-text': 'var(--color-text-primary)',
				'neutral-dark': 'var(--color-neutral-dark)',
				'neutral-light': 'var(--color-neutral-light)',
				gray: {
					1000: 'var(--color-gray-1000)'
				},
			},
			fontSize: {
				'smd': '0.938rem'
			},
			maxWidth: {
				'screen-3xl': '1800px',
			},
			screens: {
				'3xl': '1800px',
			}
		}
	},
	plugins: [
		typeography
	]
};