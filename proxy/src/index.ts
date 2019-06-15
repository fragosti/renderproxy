import Greenlock from 'greenlock-express';
import GreenlockStorageS3 from 'greenlock-storage-s3';

import { app } from './app';
import { TLS_CONNECTION_PORT } from './constants';
import { logger } from './util/logger';

const tcpPort = parseInt(process.env.PORT, 10);

// const server = createServer(app, port);

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
  cb(null, { options: opts, certs });
};

Greenlock.create({
  // Let's Encrypt v2 is ACME draft 11
  version: 'draft-11',

  server: 'https://acme-v02.api.letsencrypt.org/directory',
  // Note: If at first you don't succeed, stop and switch to staging
  // server: 'https://acme-staging-v02.api.letsencrypt.org/directory',

  // // You MUST change this to a valid email address
  // email: 'agostif93@gmail.com',

  // // You MUST NOT build clients that accept the ToS without asking the user
  // agreeTos: true,

  // You MUST change these to valid domains
  // NOTE: all domains will validated and listed on the certificate
  approveDomains,

  store,

  app,

  // Get notified of important updates and help me make greenlock better
  // communityMember: true

  // debug: true,
}).listen(tcpPort, TLS_CONNECTION_PORT);
