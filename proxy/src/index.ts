import { app } from './app';
import { createServer } from './server';
import { logger } from './util/logger';

createServer(app);

process.on('uncaughtException', (err) => {
  logger.error(err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});
