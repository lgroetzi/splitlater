// @flow

export const up = async (knex: any) => Promise.all([
  await knex.schema.createTable('user', (table) => {
    table.uuid('id').primary();
    table.string('email').notNullable().unique();
  }),
  await knex.raw(`
    CREATE TRIGGER before_insert_user
      BEFORE INSERT ON user
      FOR EACH ROW
      SET new.id = uuid();`),
]);


export const down = (knex: any) =>
  knex.schema.dropTable('user');
