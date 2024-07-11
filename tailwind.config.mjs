/** @type {import('tailwindcss').Config} */
import coreDataConfig from '@performant-software/core-data/tailwind.config';

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
			screens: {
				'3xl': '1800px',
			},
			maxWidth: {
				'screen-3xl': '1800px',
			},
			colors: {
				'neutral-dark': '#111928',
				'neutral-light': '#F5F5F5',
				gray: {
					1000: '#505A6A'
				},
			}
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms')
	],
}
