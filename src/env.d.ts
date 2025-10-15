/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '@performant-software/core-data';
declare module '@performant-software/core-data/ssr';
declare module '@performant-software/core-data/types/types/typesense';
declare module '@performant-software/geospatial';
declare module '@performant-software/shared-components';
declare module 'underscore';

declare module "astro:env/client" {
  export const STATIC_BUILD: boolean;
  export const USE_CONTENT_CACHE: boolean;
  export const CONTENT_MODE: string;
}