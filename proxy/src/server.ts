import { Application } from 'express';
import fs from 'fs';
import Greenlock from 'greenlock-express';
import GreenlockStorageS3 from 'greenlock-storage-s3';
import http from 'http';
import https from 'https';
import os from 'os';

import { AWS_CREDENTIALS, TLS_CONNECTION_PORT } from './constants';
import { database } from './util/database';
import { logger } from './util/logger';

export const createServer = (app: Application) => {
  const port = parseInt(process.env.PORT, 10);
  const shouldEnableHTTPs = process.env.ENABLE_HTTPS === 'true';
  if (process.env.NODE_ENV === 'production' && shouldEnableHTTPs) {
    createGreenlockServer(app, port);
  } else {
    createNodeServer(app, port, shouldEnableHTTPs);
  }
};

export const createNodeServer = (app: Application, port: number, shouldEnableHTTPs: boolean) => {
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

const store = GreenlockStorageS3.create({
  accountsDir: 'accounts/',
  bucketName: process.env.AWS_S3_BUCKET_NAME,
  bucketRegion: process.env.AWS_S3_BUCKET_REGION,
  configDir: 'acme/',
  debug: true,
  ...AWS_CREDENTIALS,
});

const approveDomains = (opts, certs, cb) => {
  logger.info(opts.domains);
  logger.info(certs && certs.altnames);
  opts.email = 'agostif93@gmail.com';
  opts.agreeTos = true;
  if (certs) {
    opts.domains = [certs.subject].concat(certs.altnames);
  }
  // TODO: query cache to see if we want to attempt an issue for this domain.
  cb(null, { options: opts, certs });
};

export const createGreenlockServer = (app: Application, port: number) => {
  Greenlock.create({
    // Let's Encrypt v2 is ACME draft 11
    version: 'draft-11',

    server: 'https://acme-v02.api.letsencrypt.org/directory',
    // Note: If at first you don't succeed, stop and switch to staging
    // server: 'https://acme-staging-v02.api.letsencrypt.org/directory',

    approveDomains,

    store,

    app,

    // debug: true,
  }).listen(port, TLS_CONNECTION_PORT);
};
