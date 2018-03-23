// @flow

export const up = async (knex: any) => Promise.all([
  await knex.schema.createTable('user', (table) => {
    table
      .uuid('id')
      .unique()
      .defaultTo(knex.raw('public.gen_random_uuid()'))
    table
      .string('email')
      .notNullable()
      .unique();
  }),
]);


export const down = (knex: any) =>
  knex.schema.dropTable('user');
