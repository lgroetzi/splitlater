// @flow
import { AuthError } from '../lib/auth';
import { ValidationError } from '../lib/validation';

/** Return the proper HTTP Error code based on the exception type */
export function handleError(error: Error, req: $Request, res: $Response, next: Function) {
  if (error.stack) console.log(error.stack);
  return res.sendStatus(error.code === 'ER_DUP_ENTRY' ? 409 : ({
    [AuthError.name]: 401,
    [ValidationError.name]: 400,
  })[error.constructor.name] || 500);
}
