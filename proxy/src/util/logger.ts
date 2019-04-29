import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL,
  name: process.env.APP_ID,
});

export default logger;
