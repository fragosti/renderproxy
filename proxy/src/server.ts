import { Application } from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import os from 'os';

import { TLS_CONNECTION_PORT } from './constants';
import { logger } from './util/logger';

export const createServer = (app: Application) => {
  const port = 3000;
  const shouldEnableHTTPs = process.env.ENABLE_HTTPS === 'true';
  createNodeServer(app, port, shouldEnableHTTPs);
};

export const createNodeServer = (
  app: Application,
  port: number,
  shouldEnableHTTPs: boolean,
) => {
  http.createServer(app).listen(port, () => {
    logger.info(
      `http up and running in ${process.env.NODE_ENV ||
        'development'} @: ${os.hostname()} on port: ${port}}`,
    );
  });
  if (shouldEnableHTTPs) {
    const credentials = {
      key: fs.readFileSync('dev_certs/localhost.key'),
      cert: fs.readFileSync('dev_certs/localhost.crt'),
    };
    https.createServer(credentials, app).listen(TLS_CONNECTION_PORT, () => {
      logger.info(
        `https up and running in ${process.env.NODE_ENV ||
          'development'} @: ${os.hostname()} on port: ${TLS_CONNECTION_PORT}}`,
      );
    });
  }
};
