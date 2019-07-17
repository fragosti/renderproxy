import cors from 'cors';
import express, { Application } from 'express';
import path from 'path';

import { apply } from './routes';

const createApp = (): Application => {
  const application = express();
  const root = path.normalize(__dirname + '/../..');
  application.set('appPath', root + 'client');
  application.use(cors());
  application.use(express.urlencoded());
  application.use(express.json());
  apply(application);
  return application;
};

export const app = createApp();
