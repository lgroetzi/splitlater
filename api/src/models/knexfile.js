// @flow
import config from '../config/config.json';

module.exports = {
  test: config.test.db,
  development: config.development.db,
  production: config.production.db,
};
