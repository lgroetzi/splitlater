// @flow
import moment from 'moment';

import * as libauth from '../lib/auth';
import * as libplaid from '../lib/plaid';
import * as libstores from '../lib/stores';

/** List transactions from Plaid */
export async function transactions(req: $Request, res: $Response): Promise<*> {
  const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  const user = await libauth.userFromReq(req);
  const { token } = await libstores.getServiceData(user, 'plaid');
  const transactionsResponse = await libplaid.getTransactions(token, startDate, endDate, {
    count: 250,
    offset: 0,
  });
  return res.json(transactionsResponse);
}
