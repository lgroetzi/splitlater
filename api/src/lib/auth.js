// @flow
import config from 'config';
import jsrsasign from 'jsrsasign';
import type { $Request } from 'express';
import type { UserType } from '../models/types';

import knex from '../models';
import * as libvalidation from './validation';
import * as libemail from './email';

/* Acceptable values are described in the documentation of the library
 * that receives this input:
 * https://kjur.github.io/jsrsasign/api/symbols/KJUR.jws.IntDate.html#.get */
export const EXPIRATION_LOGIN = '1hour';
export const EXPIRATION_SESSION = '1month';

export type JWTPayload = {
  sub: string,
  aud: string,
  nbf: number,
  iat: number,
  exp: number,
};

const TOKEN_ALGO = 'HS512';

export class AuthError extends Error {}

/** shortcut for the above class */
export const newError = (m: string): AuthError => new AuthError(m);

/** Creates new JWT tokens with user parameters in the payload
 *
 * @param {String} id used as `aud` field in the generated token.
 * @param {String} email used as `sub` in the generated token.
 * @param {String} expiration to be summed up to `now` in `exp` in the
 *  generated token. Acceptable values are
 *  https://kjur.github.io/jsrsasign/api/symbols/KJUR.jws.IntDate.html#.get
 * @param {String} secret is the secret used to encrypt the
 *  token. Defaults to `config.auth.secret`.
 */
export function createJWT(
  id: string, email: string, expiration: string,
  secret: string = config.get('auth.secret')): string
{
  const now = jsrsasign.jws.IntDate.get('now');
  const header = JSON.stringify({ alg: TOKEN_ALGO, typ: 'JWT' });
  const payload = JSON.stringify({
    aud: id,
    sub: email,
    nbf: now,
    iat: now,
    exp: jsrsasign.jws.IntDate.get(`now + ${expiration}`),
  });
  return jsrsasign.jws.JWS.sign(TOKEN_ALGO, header, payload, { utf8: secret });
}

/** Parse JWT tokens and return the parsed JSON payload */
export function parseJWT(token: string, secret: string = config.get('auth.secret')): JWTPayload {
  const encoded = token.split('.')[1];
  if (!encoded) {
    throw newError('Invalid Token');
  }
  if (!jsrsasign.jws.JWS.verify(token, { utf8: secret }, [TOKEN_ALGO])) {
    throw newError('Cannot verify token');
  } else {
    const buffer = Buffer.from(encoded, 'base64');
    return JSON.parse(buffer.toString('ascii'));
  }
}

/** Email login link to the received email address if it exists */
export async function emailLoginLink(emailAddress: string): Object {
  const email = libvalidation.isEmail(emailAddress);
  const [user] = await knex('user').where({ email });
  if (!user) throw newError('User does not exist');
  const loginToken = createJWT(user.id, email, EXPIRATION_LOGIN);
  const link = `${config.get('site_url')}/#/signin?token=${loginToken}`;
  await libemail.send({
    to: email,
    template: 'login',
    subject: 'Signin',
    vars: { link },
  });
  return {};
}

/** Parse a short duration token & generate a long duration token */
export function tokenLogin(token: string): Object {
  const { aud, sub } = parseJWT(token);
  return { token: createJWT(aud, sub, EXPIRATION_SESSION) };
}

/** Welcome the token or send an email with a login token */
export async function welcomeOrSendEmail(tokenOrEmail: Object): Promise<Object> {
  const { email, token } = tokenOrEmail;
  if (email) {
    return emailLoginLink(email);
  } else if (token) {
    return tokenLogin(token);
  }
  throw libvalidation.newError('Incomplete request');
}

/** Just retrieve the `jwt` attribute set by checkAuth middleware
   without getting flow mad. */
export function jwtFromReq(req: $Request): JWTPayload {
  return ((req: any).jwt: JWTPayload);
}

/** Query the database with the user found in the JWT token */
export async function userFromReq(req: $Request): Promise<UserType> {
  const { aud, sub } = jwtFromReq(req);
  const [user] = await knex('user').where({ id: aud, email: sub });
  if (user === undefined) throw newError('User does not exist');
  return user;
}
