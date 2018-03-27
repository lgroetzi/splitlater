// @flow
import { AuthError } from '../lib/auth';
import { ValidationError } from '../lib/validation';

/** Property name that might contain an error message
 *
 * Different libraries use different attributes to store error
 * messages. */
const errorMessageProperties = [
  'error_message',
];

/** Print out meaningful information within an error instance */
function printError(error: Error) {
  if (error.stack) console.log(error.stack);
  errorMessageProperties.every((property) => {
    if (Object.hasOwnProperty.call(error, property)) {
      console.log(error[property]);
      return false;
    }
    return true;
  });
}

/** Return the proper HTTP Error code based on the exception type */
export function handleError(
  error: Error,
  req: $Request,
  res: $Response,
  next: Function) // eslint-disable-line no-unused-vars
{
  printError(error);
  return res.sendStatus({
    [AuthError.name]: 401,
    [ValidationError.name]: 400,
  }[error.constructor.name] || 500);
}
