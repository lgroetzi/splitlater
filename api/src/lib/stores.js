// @flow
import knex from '../models';
import type { UserType } from '../models/types';

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
