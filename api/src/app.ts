import express, { Application } from 'express';
import jwt from 'express-jwt';
import cors from 'cors';
import jwksRsa from 'jwks-rsa';
import path from 'path';

import { handler } from './handler';
import bodyParser = require('body-parser');

// Set up Auth0 configuration
const authConfig = {
  domain: "renderproxy.auth0.com",
  audience: "https://api.renderproxy.com"
};

// Define middleware that validates incoming bearer tokens
// using JWKS from renderproxy.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});


const createApp = (): Application => {
  const application = express();
  const root = path.normalize(__dirname + '/../..');
  application.set('appPath', root + 'client');
  application.use(cors());
  application.use(bodyParser.urlencoded({ extended: false }));
  application.use(bodyParser.json());
  application.get('/', handler.root);
  application.post('/proxy_setting', checkJwt, handler.postProxySetting);
  return application;
};

export const app = createApp();
