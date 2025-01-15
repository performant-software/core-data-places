import { AbstractAuthProvider } from 'tinacms';
import { signIn, signOut } from 'auth-astro/client';

export class CustomAuthProvider extends AbstractAuthProvider {
  constructor() {
    super()
    // Do any setup here
  }
  async authenticate(props?: {}): Promise<any> {
    // Do any authentication here
    return signIn("keycloak");
  }
  async getToken() {
    // Return the token here. The token will be passed as an Authorization header in the format `Bearer <token>`
    return Promise.resolve({ id_token: "" });
  }
  async getUser() {
    // Returns a truthy value, the user is logged in and if it returns a falsy value the user is not logged in.
    // const session = await getSession(new Request('/admin'));
    // return (session == null ? void 0 : session.user) || false;
    return true;
  }
  async logout() {
    // Do any logout logic here
    await signOut();
  }
}