// @flow
import type { $Request, $Response } from 'express';
import * as auth from '../lib/auth';

export async function signin(req: $Request, res: $Response): mixed {
  const obj = req.query.token ? req.query : req.body;
  res.status(200).json(await auth.welcomeOrSendEmail(obj));
}
