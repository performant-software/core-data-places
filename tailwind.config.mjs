/** @type {import('tailwindcss').Config} */
import coreDataConfig from '@performant-software/core-data/tailwind.config';
import typeography from '@tailwindcss/typography';
import config from './public/config.json';

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
				primary: config.customization?.primary || coreDataConfig.theme.extend.colors.primary,
				'neutral-dark': '#111928',
				'neutral-light': '#F5F5F5',
				gray: {
					1000: '#505A6A'
				},
			}
		}
	},
	plugins: [
		typeography
	]
};