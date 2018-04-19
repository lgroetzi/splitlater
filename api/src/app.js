// @flow
import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import 'express-async-errors';

import * as authControllers from './controllers/auth';
import * as transactionControllers from './controllers/transactions';
import * as plaidControllers from './controllers/plaid';

import { checkAuth } from './middleware/auth';
import { handleError } from './middleware/error';

const app = express();

/* Configuration */
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors({ origin: config.get('site_url'), optionsSuccessStatus: 200 }));
app.use(checkAuth({ allow: [/^\/?$/, /^\/static\//, /^\/api\/signin\/?/] }));
app.use('/', express.static('../UI/build'));

/* API */
app.post('/api/signin', authControllers.signin);
app.get('/api/signin', authControllers.signin);
app.get('/api/transactions', transactionControllers.transactions);
app.post('/api/service/plaid/token', plaidControllers.token);

/* Error handling */
app.use(handleError);

export default app;
