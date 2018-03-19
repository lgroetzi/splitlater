// @flow

/** Constants */
export const VAL_EMAIL_MIN = 5;
export const VAL_EMAIL_MAX = 72;

/** Exception raised when any validation errors happen */
export class ValidationError extends Error {}

/** For the lazy */
export const newError = (m: string): ValidationError =>
  new ValidationError(m);

/** Check if a `mixed` value is a string.
 *
 * @param {Mixed} input: Data to be validated
 */
export function isString(input: mixed): string {
  if (typeof input === 'string') {
    return input;
  }
  throw newError('Input is not a string');
}

/**
 * Check the length of an input
 *
 * @param input: Data to be validated
 */
export function isSize(input: any, min: number, max: number): any {
  if (Object.prototype.hasOwnProperty.call(input, 'length')) {
    if (input.length < min) {
      throw newError(`should be at least ${min} chars long`);
    }
    if (input.length > max) {
      throw newError(`should be at most ${max} chars long`);
    }
    return input;
  }
  throw newError('Input does not have a length');
}

/**
 * Check if a `mixed` value is an email address of the form `xx@xx.xx`.
 *
 * @param input: Data to be validated
 */
export function isEmail(input: mixed): string {
  const [min, max] = [VAL_EMAIL_MIN, VAL_EMAIL_MAX];
  const stringInput = isSize(isString(input), min, max);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringInput)) {
    throw newError('Invalid Email address');
  }
  return stringInput;
}
