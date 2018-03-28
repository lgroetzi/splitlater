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

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors({ origin: config.get('site_url'), optionsSuccessStatus: 200 }));
app.use(checkAuth({ except: ['/signin'] }));

/* Authentication */
app.post('/signin', authControllers.signin);
app.get('/signin', authControllers.signin);

/* Transactions */
app.get('/transactions', transactionControllers.transactions);

/* Services */
app.post('/service/plaid/token', plaidControllers.token);

/* Temporary */
app.set('views', '../templates/views');
app.set('view engine', 'handlebars');
app.get('/account', plaidControllers.account);

app.use(handleError);

export default app;
