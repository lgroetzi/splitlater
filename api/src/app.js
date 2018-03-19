// @flow
import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import * as authControllers from './controllers/auth';
import { checkAuth } from './middleware/auth';

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(checkAuth({ except: ['/signin'] }));
app.use(cors({ origin: config.get('site_url'), optionsSuccessStatus: 200 }));

/* Authentication */
app.post('/signin', authControllers.signin);
app.get('/signin', authControllers.signin);

/* Transactions */
/* app.get('/transactions'); */
export default app;
