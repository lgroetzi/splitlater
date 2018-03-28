// @flow
import config from 'config';
import plaid from 'plaid';

const client = new plaid.Client(
  config.get('plaid.client_id'),
  config.get('plaid.secret'),
  config.get('plaid.public_key'),
  plaid.environments[config.get('plaid.env')],
);

export async function exchangePublicToken(token: string): Promise<string> {
  return client.exchangePublicToken(token);
}

export function getTransactions(
  accessToken: string,
  startDate: Date,
  endDate: Date,
  options: Object): Promise<Array<Object>>
{
  return client.getTransactions(accessToken, startDate, endDate, options);
}
