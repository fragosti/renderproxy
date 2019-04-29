import bodyParser from 'body-parser';
import express from 'express';
import { Application } from 'express';
import http from 'http';
import os from 'os';
import path from 'path';

import { handler } from './handler';
import l from './util/logger';

const app = express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    // app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }));
    // app.use(cookieParser(process.env.SESSION_SECRET));
    // app.use(express.static(`${root}/public`));
    app.get('/*', handler.root);
  }

  public listen(p: string | number = process.env.PORT): Application {
    http.createServer(app).listen(p, () => {
      l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname() } on port: ${p}}`);
    });
    return app;
  }
}
