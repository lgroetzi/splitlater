// @flow
import config from 'config';
import app from './app';

const port = config.get('http_port');
app.listen(port);
console.log(`Server listening on ${port}`); // eslint-disable-line no-console
