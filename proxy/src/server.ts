import { Application } from 'express';
import Greenlock from 'greenlock-express';
import GreenlockStorageS3 from 'greenlock-storage-s3';
import http from 'http';
import os from 'os';

import { TLS_CONNECTION_PORT } from './constants';
import { logger } from './util/logger';

export const createServer = (app: Application) => {
  const port = parseInt(process.env.PORT, 10);
  if (process.env.NODE_ENV === 'production') {
    createGreenlockServer(app, port);
  } else {
    createDevServer(app, port);
  }
};

export const createDevServer = (app: Application, port: number) => {
  const httpServer = http.createServer(app).listen(port, () => {
    logger.info(
      `up and running in ${process.env.NODE_ENV ||
        'development'} @: ${os.hostname()} on port: ${port}}`,
    );
  });
  return httpServer;
};

const store = GreenlockStorageS3.create({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accountsDir: 'accounts/',
  bucketName: process.env.AWS_S3_BUCKET_NAME,
  bucketRegion: process.env.AWS_S3_BUCKET_REGION,
  configDir: 'acme/',
  debug: true,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
