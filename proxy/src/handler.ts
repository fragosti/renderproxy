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
  handlePrerenderedRequest: async (proxySettings: ProxySettings, req: Request, res: Response): Promise<void> => {
    // TODO: Remove base= html tag from rendertron response.
    const fullProxyToUrl = url.getUrlToProxyTo(req, proxySettings);
    try {
      const response = await rendertron.render(fullProxyToUrl);
      res.send(response);
    } catch (err) {
      logger.error(err);
      // Just proxy the regular page if we cannot get a pre-rendered one.
      return handler.handleRegularRequest(proxySettings, req, res);
    }
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
    const domain = req.get('host');
    try {
      const proxySettings = await database.getItemAsync(domain);
      if (isRequestFromBot) {
        return handler.handlePrerenderedRequest(proxySettings, req, res);
      }
      return handler.handleRegularRequest(proxySettings, req, res);
    } catch (err) {
      logger.error(err);
      // TODO: Redirect to sign up page.
      res.send(`Could not find a proxy entry for ${domain}.`);
    }
  },
};
