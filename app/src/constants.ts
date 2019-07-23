export const AUTH0_DOMAIN = 'renderproxy.auth0.com';
export const AUTH0_CLIENT_ID = 'ZgLSqr5Q2cgUhgWKDRZrhz9YPRWDM1Ag';
export const AUTH0_AUDIENCE = 'https://api.renderproxy.com';
export const API_ENDPOINT =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://api.renderproxy.com';
export const RETURN_TO_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://renderproxy.com';
