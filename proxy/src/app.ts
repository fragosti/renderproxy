import express from 'express';
import { Application } from 'express';
import path from 'path';

import { handler } from './handler';

const createApp = (): Application => {
  const application = express();
  const root = path.normalize(__dirname + '/../..');
  application.set('appPath', root + 'client');
  // application.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
  // app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }));
  // app.use(cookieParser(process.env.SESSION_SECRET));
  // app.use(express.static(`${root}/public`));
  application.get('/*', handler.root);
  return application;
};

export const app = createApp();
