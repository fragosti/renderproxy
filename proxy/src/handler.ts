import { NextFunction, Request, Response } from 'express';
import isBot from 'isbot';
import request from 'request-promise';

import { requestTypesToRedirect } from './constants';
import logger from './util/logger';
import { rendertron } from './util/rendertron';

const originUrl = 'https://d1zqpb9e5b92wt.cloudfront.net';

export const handler = {
  handleBotRequest: async (req: Request, res: Response): Promise<void> => {
    logger.info('Called root endpoint');
    // TODO: Remove base= html tag from rendertron response.
    const response = await rendertron.render(originUrl);
    res.send(response);
  },
  handleRegularRequest: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const url = req.url;
    if (
      requestTypesToRedirect.reduce((acc, fileType) => acc || url.endsWith(fileType), false)
    ) {
      const redirectUrl = `${originUrl}${req.url}`;
      logger.info(`Redirecting to ${redirectUrl}`);
      return res.redirect(redirectUrl);
    }
    logger.info(`Proxying request for ${req.url} content from ${originUrl}`);
    req.pipe(request({ qs: req.query, uri: originUrl, headers: req.headers })).pipe(res);
  },
  root: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const url = req.url;
    if (isBot(req.get('user-agent'))) {
      logger.info(`Handing bot request for ${url}`);
      // TODO: Handle errors.
      return handler.handleBotRequest(req, res);
    }
    logger.info(`Handing regular request for ${url}`);
    return handler.handleRegularRequest(req, res, next);
  },
};
