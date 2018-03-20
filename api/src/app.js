// @flow
import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import * as authControllers from './controllers/auth';
import * as plaidControllers from './controllers/plaid';
import { checkAuth } from './middleware/auth';

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(checkAuth({ except: ['/signin', '/account', '/account/token', '/account/transactions'] }));
app.use(cors({ origin: config.get('site_url'), optionsSuccessStatus: 200 }));

/* Authentication */
app.post('/signin', authControllers.signin);
app.get('/signin', authControllers.signin);

/* Temporary */
app.set('views', '../templates/views');
app.set('view engine', 'handlebars');
app.get('/account', plaidControllers.account);
app.post('/account/token', plaidControllers.getAccessToken);
app.post('/account/transactions', plaidControllers.transactions);

/* Transactions */
/* app.get('/transactions'); */
export default app;
