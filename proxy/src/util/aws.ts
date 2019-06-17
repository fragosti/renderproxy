import AWS from 'aws-sdk';
import { logger } from './logger';

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

AWS.config.update({
  region: 'us-west-2',
  ...credentials,
});

const dynamodb = new AWS.DynamoDB();

export const aws = {
  credentials,
  dynamodb,
};

const proxyTable = {
  TableName: 'ProxyTable',
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

dynamodb.createTable(proxyTable, (err, data) => {
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
