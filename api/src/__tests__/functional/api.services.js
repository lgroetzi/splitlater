// @flow
import supertest from 'supertest';
import knexCleaner from 'knex-cleaner';
import sinon from 'sinon';

import app from '../../app';
import knex from '../../models';

import * as libauth from '../../lib/auth';
import * as libplaid from '../../lib/plaid';
import * as libstores from '../../lib/stores';

afterAll(() => knex.destroy());

describe('/service API', () => {
  let libplaidExchangePublicTokenStub;
  let libplaidGetTransactionsStub;

  beforeEach(async () => {
    await knexCleaner.clean(knex);

    libplaidExchangePublicTokenStub = sinon
      .stub(libplaid, 'exchangePublicToken')
      .callsFake(() => new Promise((resolve) => resolve({
        access_token: 'PRIV TOKEN',
      })));
    libplaidGetTransactionsStub = sinon
      .stub(libplaid, 'getTransactions')
      .callsFake(() => new Promise((resolve) => resolve({
        transactions: 'LOTS OF TRANSACTIONS',
      })));
  });

  afterEach(() => {
    libplaidExchangePublicTokenStub.restore();
    libplaidGetTransactionsStub.restore();
  });

  describe('POST /service/plaid/token', () => {
    it('should error if there is no data in the request', async () => {
      // Given a user and an API authentication token
      const user = await libstores.createUser({ email: 'uzer@zerver.co' });
      const token = libauth.createJWT(user.id, user.email, libauth.EXPIRATION_LOGIN);

      // When POST doesn't contain any data; Then it should yield
      // BadRequest
      await supertest(app)
        .post('/service/plaid/token')
        .set('Authorization', `bearer ${token}`)
        .send({})
        .expect(400);
    });

    it('Should save token within service data', async () => {
      // Given a user and an API authentication token
      const user = await libstores.createUser({ email: 'uzer@zerver.co' });
      const token = libauth.createJWT(user.id, user.email, libauth.EXPIRATION_LOGIN);

      // When POST doesn't contain any data; Then it should yield
      // BadRequest
      await supertest(app)
        .post('/service/plaid/token')
        .set('Authorization', `bearer ${token}`)
        .send({ publicToken: 'public token' })
        .expect(200);

      // And Then the token is actually saved within the database
      const [service] = await knex('service');
      expect(service.name).toBe('plaid');
      expect(service.data.token).toBe('PRIV TOKEN');
    });
  }); /* "POST /service/plaid/token" */

  describe('GET /transactions with a plaid user', () => {
    it('should error if user does not have a service account', async () => {
      // Given a user and an API authentication token
      const user = await libstores.createUser({ email: 'uzer@zerver.co' });
      const token = libauth.createJWT(user.id, user.email, libauth.EXPIRATION_LOGIN);

      // When GET doesn't contain any data; Then it should yield
      // BadRequest
      await supertest(app)
        .get('/transactions')
        .set('Authorization', `bearer ${token}`)
        .expect(400);
    });

    it('should return transactions from the plaid backend', async () => {
      // Given a user and an API authentication token
      const user = await libstores.createUser({ email: 'uzer@zerver.co' });
      const token = libauth.createJWT(user.id, user.email, libauth.EXPIRATION_LOGIN);

      // And given that the user has a service account attached
      await libstores.createService(user, 'plaid', { token });

      // When GET doesn't contain any data;
      const { body } = await supertest(app)
        .get('/transactions')
        .set('Authorization', `bearer ${token}`)
        .expect(200);

      // Then it should contain the transaction
      expect(body.transactions).toBe('LOTS OF TRANSACTIONS');
    });
  }); /* "POST /transactions with a plaid user" */
}); /* "Methods under /service[s]" */
