import type { APIRoute } from 'astro';
import { experimental_createIslandRoute } from '@tinacms/astro/experimental';
import { islands } from '@lib/islands';

export const prerender = false;
export const getStaticPaths = () => [];
export const ALL: APIRoute = experimental_createIslandRoute(islands);