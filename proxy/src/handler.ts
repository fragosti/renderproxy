import { Request, Response } from 'express';
import isBot from 'isbot';
import request from 'request';

import { requestTypesToRedirect } from './constants';
import { ProxySettings } from './types';
import { database } from './util/database';
import { logger } from './util/logger';
import { rendertron } from './util/rendertron';
import { url } from './util/url';

export const handler = {
  handleBotRequest: async (proxySettings: ProxySettings, req: Request, res: Response): Promise<void> => {
    // TODO: Remove base= html tag from rendertron response.
    // TODO: handle error
    const response = await rendertron.render(proxySettings.proxyToUrl);
    res.send(response);
    return;
  },
  handleRegularRequest: async (proxySettings: ProxySettings, req: Request, res: Response): Promise<void> => {
    const { proxyToUrl, shouldRedirectIfPossible } = proxySettings;
    const fullProxyToUrl = url.getUrlToProxyTo(req, proxySettings);
    const fileType = url.getFileType(req);
    if (shouldRedirectIfPossible && req.protocol === 'https' && fileType && requestTypesToRedirect.has(fileType)) {
      logger.info(`Redirecting to ${fullProxyToUrl}`);
      return res.redirect(fullProxyToUrl);
    }
    logger.info(`Proxying request for ${req.url} content from ${proxyToUrl}`);
    const { host, ...restHeaders } = req.headers;
    req.pipe(request({ qs: req.query, uri: fullProxyToUrl, headers: restHeaders })).pipe(res);
  },
  root: async (req: Request, res: Response): Promise<void> => {
    const fullUrl = url.fullFromRequest(req);
    const isRequestFromBot = isBot(req.get('user-agent'));
    logger.info(`Handling request for ${fullUrl}. Is bot: ${isRequestFromBot}`);
    res.send('HELLO WORLD 7');
    // // TODO: Handle errors.
    // const proxySettings = await database.getItemAsync(req.get('host'));
    // if (isRequestFromBot) {
    //   return handler.handleBotRequest(proxySettings, req, res);
    // }
    // return handler.handleRegularRequest(proxySettings, req, res);
    },
};
