// @flow
import knex from '../models';

/** Create a row in the user table
 *
 * @param options: { name: string, email: string }
 */
export async function createUser(options: any): Promise<Object> {
  const { name, email } = options;
  await knex('user').insert({ name, email });
  const [user] = await knex('user').where({ email });
  return user;
}
