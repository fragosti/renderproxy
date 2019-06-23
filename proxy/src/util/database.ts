import Bluebird from 'bluebird';
import { AWS } from './aws';
import { logger } from './logger';

import { ProxySettings } from '../types';

const TABLE_NAME = 'ProxyTable';

const dynamoDb = new AWS.DynamoDB();
const documentClient = Bluebird.promisifyAll(new AWS.DynamoDB.DocumentClient()) as any;

export const database = {
  getItemAsync: async (domain: string): Promise<ProxySettings> => {
    const itemWrapper = await documentClient.getAsync({
      TableName: TABLE_NAME,
      Key: {
        domain,
      },
    });
    return itemWrapper.Item;
  },
};

// Idempotently create table.
const proxyTable = {
  TableName: TABLE_NAME,
  KeySchema: [
    { AttributeName: 'domain', KeyType: 'HASH'},
  ],
  AttributeDefinitions: [
    { AttributeName: 'domain', AttributeType: 'S'},
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

dynamoDb.createTable(proxyTable, (err, data) => {
  if (err) {
    if (err.code === 'ResourceInUseException') {
      logger.info(`Table ${proxyTable.TableName} already exists.`);
      return;
    }
    logger.error(err);
    return;
  }
  logger.info(data);
  return;
});
