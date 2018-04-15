// @flow
import supertest from 'supertest';
import knexCleaner from 'knex-cleaner';
import sinon from 'sinon';
import jsrsasign from 'jsrsasign';

import app from '../../app';
import knex from '../../models';

import * as libauth from '../../lib/auth';
import * as libemail from '../../lib/email';

afterAll(() => knex.destroy());

describe('POST /api/signin - Endpoint to Sign-In users', () => {
  describe('when user posts an email address', () => {
    it('should error if there is no data in the request', async () => {
      // When POST doesn't contain any data
      const { statusCode } = await supertest(app)
        .post('/api/signin')
        .send({});
      // Then it should yield BadRequest
      expect(statusCode).toBe(400);
    });

    it('should error if there is no user with the data', async () => {
      // When POST request hits the signin endpoint with an email of a
      // user that doesn't exist in the database
      const { statusCode } = await supertest(app)
        .post('/api/signin')
        .send({ email: 'whtevr@no.co' });

      // Then response status code should be 401
      expect(statusCode).toBe(401);
    });

    describe('@database', () => {
      let jsrsasignStub;
      let libemailMock;

      beforeEach(async () => {
        await knexCleaner.clean(knex);
        libemailMock = sinon.mock(libemail);
        jsrsasignStub = sinon
          .stub(jsrsasign.jws.JWS, 'sign')
          .callsFake(() => 'TOKEN');
      });

      afterEach(() => {
        libemailMock.restore();
        jsrsasignStub.restore();
      });

      it('should work if the user exists', async () => {
        // Given a user in the database
        const email = 'foo@blah.com';
        await knex('user').insert({ email });

        // And given that we set some expectations for the libemail mock
        libemailMock.expects('send').once().withArgs({
          to: 'foo@blah.com',
          subject: 'Signin',
          template: 'login',
          vars: { link: 'http://localhost:8000/signin?token=TOKEN' },
        });

        // When a login attempt happens with that user
        const { statusCode } = await supertest(app).post('/api/signin').send({ email });

        // Then the response code should be 200
        expect(statusCode).toBe(200);

        // Then it should send the user an email
        libemailMock.verify();
      });

      it('GET /api/signin?email=??? should work if the user exists', async () => {
        // Given a user in the database
        const email = 'foo@blah.com';
        await knex('user').insert({ email });

        // And given that we set some expectations for the libemail mock
        libemailMock.expects('send').once().withArgs({
          to: 'foo@blah.com',
          subject: 'Signin',
          template: 'login',
          vars: { link: 'http://localhost:8000/signin?token=TOKEN' },
        });

        // When a login attempt happens with that user
        const { statusCode } = await supertest(app).get(`/api/signin?email=${email}`);

        // Then the response code should be 200
        expect(statusCode).toBe(200);

        // Then it should send the user an email
        libemailMock.verify();
      });
    });
  });
});

describe('GET /api/signin?token=TOK - Endpoint to Sign-In users', () => {
  describe('when user posts a token', () => {
    it('should fail if token is invalid', async () => {
      // When user posts an invalid token to signin
      const { statusCode } = await supertest(app)
        .get('/api/signin?token=foo');

      // Then response status code should be 401
      expect(statusCode).toBe(401);
    });

    it('should return another token if the token is valid', async () => {
      // Given that we have a valid token
      const token = libauth.createJWT('uuid', 'foo@blah.com', '1hour');

      // When the valid token is posted to the signin url
      const response = await supertest(app).get(`/api/signin?token=${token}`);

      // Then the status code should represent success
      expect(response.statusCode).toBe(200);

      // And then there should be a token in the response
      expect(response.body.token).not.toBeUndefined();

      // Then the new token should be issued to the same user
      const newToken = libauth.parseJWT(response.body.token);
      expect(newToken.sub).toEqual('foo@blah.com');
    });
  });
});
