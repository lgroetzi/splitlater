// @flow
import config from 'config';
import moment from 'moment';
import type { $Request, $Response } from 'express';

import { handleError } from '../lib/http';
import * as libtemplate from '../lib/template';
import * as libplaid from '../lib/plaid';

var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;

export async function account(req: $Request, res: $Response): mixed {
  try {
    const context = {
      plaid_env: config.get('plaid.env'),
      plaid_public_key: config.get('plaid.public_key'),
    };
    const template = new Buffer(await libtemplate.byName('plaid', context));
    res.set('content-type', 'text/html');
    res.status(200).send(template);
  } catch (error) {
    res.sendStatus(handleError(error));
  }
}

export async function getAccessToken(req: $Request, res: $Response): mixed {
  console.log(`Acquiring Access Token:`);
  console.log(req.body);
  try {
    const { access_token, item_id } = await libplaid.exchangePublicToken(req.body.public_token);

    ACCESS_TOKEN = access_token;
    ITEM_ID = item_id;

    console.log('Access Token: ' + ACCESS_TOKEN);
    console.log('Item ID: ' + ITEM_ID);

    return res.json({ 'error': false });
  } catch (error) {
    const msg = 'Could not exchange public_token!';
    console.log(msg + '\n');
    console.log(error);
    return res.json({ error: msg });
  }
}

export async function transactions(req: $Request, res: $Response): mixed {
  var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  var endDate = moment().format('YYYY-MM-DD');
  try {
    console.log('TOKEN', ACCESS_TOKEN);
    const transactionsResponse = await libplaid.getTransactions(ACCESS_TOKEN, startDate, endDate, {
      count: 250,
      offset: 0,
    });
    console.log('pulled ' + transactionsResponse.transactions.length + ' transactions');
    res.json(transactionsResponse);
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.json({ error: error });
  }
}

/* app.post('/get_access_token', function(request, response, next) {
 *   PUBLIC_TOKEN = request.body.public_token;
 *   client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
 *     if (error != null) {
 *       var msg = 'Could not exchange public_token!';
 *       console.log(msg + '\n' + error);
 *       return response.json({
 *         error: msg
 *       });
 *     }
 *     ACCESS_TOKEN = tokenResponse.access_token;
 *     ITEM_ID = tokenResponse.item_id;
 *     console.log('Access Token: ' + ACCESS_TOKEN);
 *     console.log('Item ID: ' + ITEM_ID);
 *     response.json({
 *       'error': false
 *     });
 *   });
 * });*/
