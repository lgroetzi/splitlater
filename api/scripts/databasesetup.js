// @flow

/**
 * Script for setting up user & database.
 *
 * It's mostly used for setting up the development environment.
 *
 * The commands CREATE {USER,DATABASE} don't accept the regular
 * parameter binding. For that reason, the pg-format package is being
 * used to properly escape the name and password passed to the
 * command.
 *
 * More info here https://github.com/brianc/node-postgres/issues/1337
 */

import config from 'config';
import format from 'pg-format';
import pg from 'pg';
import { URL } from 'url';

/** Get an instance of a connected client */
function getConnectedClient(url: string): pg.Client {
  const client = new pg.Client(url);
  client.connect();
  return client;
}

/** Create a user in postgres if it doesn't exist */
async function createUser(client: pg.Client, name: string, password: string): Promise<void> {
  const exists = await client.query(
    'SELECT 1 FROM pg_roles WHERE rolname=$1', [name]);
  if (exists.rowCount === 0) {
    await client.query(format(
      'CREATE USER %s WITH PASSWORD \'%s\';',
      name, password));
    console.log('user created'); // eslint-disable-line no-console
  }
}

/** Create a database and set its owner */
async function createDatabase(client: pg.Client, database: string, owner: string): Promise<void> {
  const exists = await client.query(
    'SELECT 1 FROM pg_database WHERE datname=$1', [database]);
  if (exists.rowCount === 0) {
    await client.query(format(
      'CREATE DATABASE %s OWNER %s;', database, owner));
    console.log('database created'); // eslint-disable-line no-console
  }
}

/** Create postgres extensions */
async function createExtensions(client: pg.Client): Promise<void> {
  await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
}

function replaceDatabase(url: string, newDatabase: string): string {
  const obj = new URL(url);
  obj.pathname = `/${newDatabase}`;
  return obj.toString();
}

/** Kick things off */
async function main(): Promise<void> {
  const url = new URL(config.db.connection);
  const database = url.pathname.slice(1);

  /* Connect with maintainance account */
  const client = getConnectedClient(config.db.maintainance_conn);
  await createUser(client, url.username, url.password);
  await createDatabase(client, database, url.username);
  await client.end();

  /* Connect with maintainance to the recently created database */
  const newUrl = replaceDatabase(config.db.maintainance_conn, database);
  const clientOtherDb = getConnectedClient(newUrl);
  await createExtensions(clientOtherDb);
  await clientOtherDb.end();
}

if (!module.parent) main();
