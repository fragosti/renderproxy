import { NextFunction, Request, Response } from 'express';
import isBot from 'isbot';
import request from 'request';

import { requestTypesToRedirect } from './constants';
import { database } from './util/database';
import { logger } from './util/logger';
import { rendertron } from './util/rendertron';
import { url } from './util/url';

export const handler = {
  handleBotRequest: async (proxyToUrl: string, req: Request, res: Response): Promise<void> => {
    // TODO: Remove base= html tag from rendertron response.
    const response = await rendertron.render(proxyToUrl);
    res.send(response);
    return;
  },
  handleRegularRequest: async (proxyToUrl: string, req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (
      requestTypesToRedirect.reduce((acc, fileType) => acc || req.url.endsWith(fileType), false)
    ) {
      const redirectUrl = `${proxyToUrl}${req.url}`;
      logger.info(`Redirecting to ${redirectUrl}`);
      return res.redirect(redirectUrl);
    }
    logger.info(`Proxying request for ${req.url} content from ${proxyToUrl}`);
    const { host, ...restHeaders } = req.headers;
    req.pipe(request({ qs: req.query, uri: proxyToUrl, headers: restHeaders })).pipe(res);
  },
  root: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const fullUrl = url.fullFromRequest(req);
    const isRequestFromBot = isBot(req.get('user-agent'));
    logger.info(`Handling request for ${fullUrl}. Is bot: ${isRequestFromBot}`);
    const { proxyToUrl } = await database.getItemAsync(req.get('host'));
    if (isRequestFromBot) {
      // TODO: Handle errors.
      return handler.handleBotRequest(proxyToUrl, req, res);
    }
    return handler.handleRegularRequest(proxyToUrl, req, res, next);
  },
};
