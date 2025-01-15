import Keycloak from '@auth/core/providers/keycloak';
import { defineConfig } from 'auth-astro';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID || 'tinacms',
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET || '',
      issuer: process.env.AUTH_KEYCLOAK_ISSUER || 'https://keycloak.archivengine.com/realms/GBoF'
    }),
  ],
});