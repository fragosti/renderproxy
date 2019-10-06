import { createClient } from 'redis';
import { promisify } from 'util';

const redisClient = createClient({
  host: process.env.REDIS_HOST,
});

export const redis = {
  getAsync: promisify(redisClient.get).bind(redisClient),
  mgetAsync: promisify(redisClient.mget).bind(redisClient),
};
