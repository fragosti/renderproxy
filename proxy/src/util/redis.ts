import { createClient } from 'redis';
import { promisify } from 'util';

const redisClient = createClient({
  host: process.env.REDIS_HOST,
});

export const redis = {
  incrAsync: promisify(redisClient.incr).bind(redisClient),
};