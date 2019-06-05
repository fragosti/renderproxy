import Greenlock from 'greenlock-express';
import GreenlockStorageS3 from 'greenlock-storage-s3';
import { app } from './app';

const tcpPort = parseInt(process.env.PORT, 10);

// const server = createServer(app, port);

const store = GreenlockStorageS3.create({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketRegion: process.env.AWS_S3_BUCKET_REGION,
  bucketName: process.env.AWS_S3_BUCKET_NAME,
  configDir: 'acme/',
  accountsDir: 'accounts/',
  debug: true,
});

Greenlock.create({
  // Let's Encrypt v2 is ACME draft 11
  version: 'draft-11',

  // server: 'https://acme-v02.api.letsencrypt.org/directory',
  // Note: If at first you don't succeed, stop and switch to staging
  server: 'https://acme-staging-v02.api.letsencrypt.org/directory',

  // You MUST change this to a valid email address
  email: 'agostif93@gmail.com',

  // You MUST NOT build clients that accept the ToS without asking the user
  agreeTos: true,

  // You MUST change these to valid domains
  // NOTE: all domains will validated and listed on the certificate
  approvedDomains: ['samples3spasite.com'],

  store,

  app,

  // Get notified of important updates and help me make greenlock better
  // communityMember: true

  //, debug: true
}).listen(tcpPort, 443);
