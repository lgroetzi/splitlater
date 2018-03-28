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

  beforeEach(async () => {
    await knexCleaner.clean(knex);
    libplaidExchangePublicTokenStub = sinon
      .stub(libplaid, 'exchangePublicToken')
      .callsFake(() => new Promise((resolve) => resolve({
        access_token: 'PRIV TOKEN'
      })));
  });

  afterEach(() => {
    libplaidExchangePublicTokenStub.restore();
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
  });  /* "POST /service/plaid/token" */
});  /* "Methods under /service[s]" */
