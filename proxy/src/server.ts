import { GCloudStoreCreate } from '@interactivetraining/le-store-gcloud-storage';
import { Application } from 'express';
import fs from 'fs';
import Greenlock from 'greenlock-express';
import http from 'http';
import https from 'https';
import os from 'os';

import { TLS_CONNECTION_PORT } from './constants';
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

const approveDomains = async (opts, certs, cb) => {
  logger.info(opts.domains);
  logger.info(certs && certs.altnames);
  // TODO: change email to final domain email once decided
  opts.email = 'agostif93@gmail.com';
  opts.agreeTos = true;
  if (certs) {
    opts.domains = [certs.subject].concat(certs.altnames);
  }
  const doDomainsExistPromises = (opts.domains as string[]).map(async (domain) => {
    try {
      await database.getItemAsync(domain);
      return true;
    } catch (err) {
      logger.info(err);
      return false;
    }
  });
  const doDomainsExist = await Promise.all(doDomainsExistPromises);
  const shouldIssueCertificates = doDomainsExist.every((exists) => exists);
  if (shouldIssueCertificates) {
    cb(null, { options: opts, certs });
  } else {
    cb(new Error(`${opts.domains.join(', ')} was not found in the database. Not issuing cert.`));
  }
};

export const createGreenlockServer = (app: Application, port: number) => {
  const store = GCloudStoreCreate({
    bucketName: process.env.CLOUD_STORAGE_BUCKET_NAME,
    projectId: process.env.CLOUD_PROJECT_ID,
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

    approveDomains,

    store,

    app,

    debug: true,
  }).listen(port, TLS_CONNECTION_PORT);
};
