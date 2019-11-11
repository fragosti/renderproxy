import express from 'express';
import { Application } from 'express';

import { handler } from './handler';

const createApp = (): Application => {
  const application = express();
  application.all('*', handler.root);
  application.disable('x-powered-by');
  return application;
};

export const app = createApp();
