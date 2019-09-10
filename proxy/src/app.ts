import express from 'express';
import { Application } from 'express';
import path from 'path';

import { handler } from './handler';

const createApp = (): Application => {
  const application = express();
  const root = path.normalize(__dirname + '/../..');
  application.set('appPath', root + 'client');
  application.get('/*', handler.root);
  return application;
};

export const app = createApp();
