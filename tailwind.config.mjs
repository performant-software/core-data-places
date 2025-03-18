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
			colors: {
				primary: config.branding?.primary || coreDataConfig.theme.extend.colors.primary,
				'neutral-dark': '#111928',
				'neutral-light': '#F5F5F5',
				gray: {
					1000: '#505A6A'
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