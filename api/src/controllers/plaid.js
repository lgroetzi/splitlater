// @flow
import config from 'config';
import type { $Request, $Response } from 'express';

import * as libauth from '../lib/auth';
import * as libvalidation from '../lib/validation';
import * as libtemplate from '../lib/template';
import * as libplaid from '../lib/plaid';
import * as libstores from '../lib/stores';


export async function account(req: $Request, res: $Response): Promise<*> {
  const context = {
    plaid_env: config.get('plaid.env'),
    plaid_public_key: config.get('plaid.public_key'),
  };
  const template = Buffer.from(await libtemplate.byName('plaid', context));
  res.set('content-type', 'text/html');
  res.status(200).send(template);
}

/** Exchange the public token received by the Plaid's Link button */
export async function token(req: $Request, res: $Response): Promise<*> {
  const { publicToken } = req.body;
  if (!publicToken) throw libvalidation.newError('Token missing');
  const result = await libplaid.exchangePublicToken(publicToken);
  const user = await libauth.userFromReq(req);
  await libstores.createService(user, 'plaid', { token: result.access_token });
  return res.sendStatus(200);
}
