// @flow

export const up = async (knex: any) => Promise.all([
  await knex.schema.createTable('service', (table) => {
    table
      .uuid('id')
      .unique()
      .defaultTo(knex.raw('public.gen_random_uuid()'));
    table
      .uuid('userid')
      .notNullable()
      .references('id')
      .inTable('user');
    table
      .string('name')
      .notNullable();
    table.json('data');
  }),
]);


export const down = (knex: any) =>
  knex.schema.dropTable('service');
