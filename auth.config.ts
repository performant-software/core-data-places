import Keycloak from '@auth/core/providers/keycloak';
import { defineConfig } from 'auth-astro';

process.loadEnvFile();

export default defineConfig({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID || 'tinacms',
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET || '',
      issuer: process.env.AUTH_KEYCLOAK_ISSUER || ''
    }),
  ],
});