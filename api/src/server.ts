import { GCloudStoreCreate } from '@interactivetraining/le-store-gcloud-storage';
import { Application } from 'express';
import fs from 'fs';
import Greenlock from 'greenlock-express';
import http from 'http';
import https from 'https';
import os from 'os';

import { CLOUD_PROJECT_ID, TLS_CONNECTION_PORT } from './constants';
import { logger } from './util/logger';

export const createServer = (app: Application) => {
  const port = 3002;
  const shouldEnableHTTPs = process.env.ENABLE_HTTPS === 'true';
  if (process.env.NODE_ENV === 'production' && shouldEnableHTTPs) {
    createGreenlockServer(app, port);
  } else {
    createNodeServer(app, port, shouldEnableHTTPs);
  }
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

export const createGreenlockServer = (app: Application, port: number) => {
  const store = GCloudStoreCreate({
    projectId: CLOUD_PROJECT_ID,
    bucketName: process.env.CLOUD_STORAGE_BUCKET_NAME,
    privateKey: process.env.CLOUD_PRIVATE_KEY,
    clientEmail: process.env.CLOUD_CLIENT_EMAIL,
    dbFileName: 'proxy-certs.json',
  });

  Greenlock.create({
    // Let's Encrypt v2 is ACME draft 11
    version: 'draft-11',

    server: 'https://acme-v02.api.letsencrypt.org/directory',
    // Note: If at first you don't succeed, stop and switch to staging
    // server: 'https://acme-staging-v02.api.letsencrypt.org/directory',

    approveDomains: ['api.renderproxy.com'],

    email: 'francesco.agosti@renderproxy.com',
    agreeTos: true,

    store,

    app,

    debug: true,
  }).listen(port, TLS_CONNECTION_PORT);
};
