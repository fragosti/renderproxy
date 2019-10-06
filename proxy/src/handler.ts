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
    const urlToProxy = url.getUrlToProxyTo(req, proxySettings);
    const fullUrl = url.fullFromRequest(req);
    try {
      logger.info(`Rendering request for ${fullUrl} content with rendertron render ${urlToProxy}`);
      const response = await rendertron.render(urlToProxy);
      res.send(response);
    } catch (err) {
      logger.error(err);
      // Just proxy the regular page if we cannot get a pre-rendered one.
      return handler.handleRegularRequest(proxySettings, req, res);
    }
  },
  handleRegularRequest: async (proxySettings: ProxySettings, req: Request, res: Response): Promise<void> => {
    const { shouldRedirectIfPossible } = proxySettings;
    const urlToProxy = url.getUrlToProxyTo(req, proxySettings);
    const fileType = url.getFileType(req);
    const fullUrl = url.fullFromRequest(req);
    if (shouldRedirectIfPossible && req.protocol === 'https' && fileType && requestTypesToRedirect.has(fileType)) {
      logger.info(`Redirecting to ${urlToProxy}`);
      return res.redirect(urlToProxy);
    }
    logger.info(`Proxying request for ${fullUrl} content from ${urlToProxy}`);
    const { host, ...restHeaders } = req.headers;
    req.pipe(request({ qs: req.query, uri: urlToProxy, headers: restHeaders })).pipe(res);
  },
  root: async (req: Request, res: Response): Promise<void> => {
    const fullUrl = url.fullFromRequest(req);
    const isRequestFromBot = isBot(req.get('user-agent'));
    logger.info(`Handling request for ${fullUrl}. Is bot: ${isRequestFromBot}`);
    const domain = req.get('host');
    database.trackUsageAsync(domain);
    try {
      const proxySettings = await database.getProxySettingsAsync(domain);
      if (proxySettings.prerenderSetting === 'all' || (proxySettings.prerenderSetting === 'bot' && isRequestFromBot)) {
        return handler.handlePrerenderedRequest(proxySettings, req, res);
      }
      return handler.handleRegularRequest(proxySettings, req, res);
    } catch (err) {
      logger.error(err);
      // TODO: Redirect to sign up page or error page for all errors.
      res.send(`Could not find a proxy entry for ${domain}.`);
    }
  },
};

process.on('uncaughtException', (err) => {
  logger.error(err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});
