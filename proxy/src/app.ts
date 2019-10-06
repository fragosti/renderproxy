import express from 'express';
import { Application } from 'express';
import path from 'path';

import { handler } from './handler';

const createApp = (): Application => {
  const application = express();
  application.all('*', handler.root);
  return application;
};

export const app = createApp();
