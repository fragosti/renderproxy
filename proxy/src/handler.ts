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
    const isHtmlRequest = url.isHtmlRequest(req);
    const { host, ...restHeaders } = req.headers;
    const originRequestParams = {
      method: req.method,
      qs: req.query,
      uri: urlToProxy,
      headers: restHeaders,
      body: req.body,
    };
    if (
      !isHtmlRequest &&
      shouldRedirectIfPossible &&
      req.protocol === 'https' &&
      requestTypesToRedirect.has(fileType)
    ) {
      logger.info(`Redirecting ${fullUrl} to ${urlToProxy}`);
      return res.redirect(urlToProxy);
    }
    logger.info(`Proxying request for ${fullUrl} content from ${urlToProxy}`);
    req.pipe(
      request(originRequestParams),
    ).pipe(res);
  },
  root: async (req: Request, res: Response): Promise<void> => {
    const isRequestFromBot = isBot(req.get('user-agent'));
    const domain = req.get('host');
    database.trackUsageAsync(domain);
    try {
      const proxySettings = await database.getProxySettingsAsync(domain);
      const isHtmlRequest = url.isHtmlRequest(req);
      if (
        isHtmlRequest &&
        proxySettings.prerenderSetting === 'all' ||
        (proxySettings.prerenderSetting === 'bot' && isRequestFromBot)
      ) {
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
