import NextAuth from 'next-auth';
import { TinaAuthJSOptions } from 'tinacms-authjs/dist/index.js';
import { databaseClient } from '@tina/databaseClient';
import Keycloak from 'next-auth/providers/keycloak';

const NextAuthOptions = TinaAuthJSOptions({
  databaseClient,
  secret: import.meta.env.NEXTAUTH_SECRET!,
  debug: true,
  uidProp: 'username',
  providers: [
    Keycloak({
      clientId: import.meta.env.AUTH_KEYCLOAK_ID,
      clientSecret: import.meta.env.AUTH_KEYCLOAK_SECRET,
      issuer: import.meta.env.AUTH_KEYCLOAK_ISSUER
    })
  ]
});

export default (req, res) => {
  console.log(req);
  return NextAuth(NextAuthOptions)(req, res);
}