// @flow
import knex from '../models';
import type { UserType } from '../models/types';
import * as libvalidation from './validation';

/** Type for which fields must be passed to create a new user.
 *
 * This is meant to be a subset of `UserType` declared in the module
 * `src/models/types.js`.
 */
type CreateUserType = {
  email: string,
};

/** Create a row in the user table
 *
 * @param options: { name: string, email: string }
 */
export async function createUser(options: CreateUserType): Promise<UserType> {
  await knex('user').insert(options);
  const [user] = await knex('user').where({ email: options.email });
  return user;
}

/** Create new a service account for a user
 *
 * @param {UserType} user is the owner of the service account being
 *  created.
 * @param {string} name of the service account.
 * @param {Object} data from the service account to be saved.
 */
export async function createService(
  user: UserType,
  name: string,
  data: Object): Promise<*>
{
  await knex('service').insert({ userid: user.id, name, data });
}

/** Return the data field of a service attached to a user
 *
 * @param {UserType} user that has the service
 * @param {string} name of the service
 */
export async function getServiceData(
  user: UserType,
  name: string): Promise<Object>
{
  const [result] = await knex('service').where({ userid: user.id, name });
  if (!result) throw libvalidation.newError('No service attached');
  return result.data;
}
