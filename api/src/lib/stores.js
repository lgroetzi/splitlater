// @flow
import knex from '../models';

/** Create a row in the user table
 *
 * @param options: { name: string, email: string }
 */
export async function createUser(options: any): Promise<Object> {
  const { name, email } = options;
  await knex('user').insert({ email });
  const [user] = await knex('user').where({ email });
  return user;
}

/** Create new a service account for a user */
export async function createService(
  user: UserType,
  name: string,
  data: Object): Promise
{
  await knex('service').insert({ userid: user.id, name, data });
}
