// @flow
import Knex from 'knex';
import knexfile from './knexfile';

const knex = Knex(knexfile);

export type GetOrCreateProps = {
  table: string,
  data: Object,
  where: Object,
  fields?: Array<string>,
};

export async function getOrCreate(props: GetOrCreateProps): Promise<Object> {
  const {
    table, data, where, fields,
  } = props;
  const allFields = (fields || []).concat(['id']);
  const find = knex(table).select(allFields).where(where);
  let [instance] = await find;
  if (!instance) {
    await knex(table).insert(data);
    [instance] = await find;
  }
  return instance;
}

export default knex;
