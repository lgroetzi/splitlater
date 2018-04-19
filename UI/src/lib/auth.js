import * as webapi from './webapi';

const AUTH_TOKEN_KEY = 'authToken';

export async function checkUrlToken() {
  if (window.location.hash.startsWith('#/signin?token=')) {
    const loginToken = window.location.hash.slice(15);
    const sessionToken = await webapi.signin({ token: loginToken });
    window.localStorage.setItem(AUTH_TOKEN_KEY, sessionToken);
    window.location.replace(window.location.origin);
  }
}

export async function signIn({ email, token }) {
  return webapi.signin({ email, token });
}

export function isLoggedIn() {
  return !!window.localStorage.getItem(AUTH_TOKEN_KEY);
}
