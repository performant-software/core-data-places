import Keycloak from '@auth/core/providers/keycloak';
import { defineConfig } from 'auth-astro';

export default defineConfig({
  providers: [
    Keycloak({
      clientId: import.meta.env.AUTH_KEYCLOAK_ID,
      clientSecret: import.meta.env.AUTH_KEYCLOAK_SECRET,
      issuer: import.meta.env.AUTH_KEYCLOAK_ISSUER
    }),
  ],
});