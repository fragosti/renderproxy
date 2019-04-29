import { Request, Response, NextFunction } from 'express';
import proxy  from 'express-http-proxy';
import isBot from 'isbot';

import { rendertron } from './util/rendertron';
import logger from './util/logger';
import { requestTypesToRedirect } from './constants';
import { urlencoded } from 'body-parser';

const originUrl = 'http://sample-s3-spa.com.s3-website-us-west-2.amazonaws.com';

export const handler = {
  root: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const url = req.url;
    if (isBot(req.get('user-agent'))) {
      logger.info(`Handing bot request for ${url}`);
      return handler.handleBotRequest(req, res);
    }
    logger.info(`Handing regular request for ${url}`);
    return handler.handleRegularRequest(req, res, next);
  },
  handleBotRequest: async (req: Request, res: Response): Promise<void> => {
    logger.info('Called root endpoint');
    // TODO: Remove base= html tag from rendertron response.
    const response = await rendertron.render(originUrl);
    res.send(response.data);
  },
  handleRegularRequest: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const proxyHandler = proxy(originUrl);
    const url = req.url;
    if (
      requestTypesToRedirect.reduce((acc, fileType) => acc || url.endsWith(fileType), false)
    ) {
      const redirectUrl = `${originUrl}${req.url}`;
      logger.info(`Redirecting to ${redirectUrl}`);
      return res.redirect(redirectUrl);
    }
    logger.info(`Proxying request for ${req.url} content from ${originUrl}`);
    return proxyHandler(req, res, next);
  }
}