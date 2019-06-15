import { Application } from 'express';
import http from 'http';
import os from 'os';

import { logger } from './util/logger';

export const createServer = (app: Application, port: number): http.Server => {
  const httpServer = http.createServer(app).listen(port, () => {
    logger.info(
      `up and running in ${process.env.NODE_ENV ||
        'development'} @: ${os.hostname()} on port: ${port}}`,
    );
  });
  return httpServer;
};
