// @flow
import app from './app';
import config from './config';

app.listen(config.http_port);
// eslint-disable-next-line no-console
console.log(`Server listening on ${config.http_port}`);
