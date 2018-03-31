const AUTH_TOKEN_KEY = 'authToken';

async function handleResponse(response) {
  if (response.status != 200) {
    throw new Error(await response.text());
  }
}

export async function signIn(email) {
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  };
  return handleResponse(
    await fetch('http://localhost:8001/signin', fetchOptions));
}

export function isLoggedIn() {
  // Temporary
  return true;// !!window.localStorage.getItem(AUTH_TOKEN_KEY);
}