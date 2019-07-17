import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

// Set up Auth0 configuration
const authConfig = {
  domain: 'renderproxy.auth0.com',
  audience: 'https://api.renderproxy.com'
};

// Define middleware that validates incoming bearer tokens
// using JWKS from renderproxy.auth0.com
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ['RS256'],
});
