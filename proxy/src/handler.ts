import { Request, Response } from 'express';
import isBot from 'isbot';
import request from 'request';
import { promisify } from 'util';

import { requestTypesToRedirect } from './constants';
import { ProxySettings } from './types';
import { database } from './util/database';
import { logger } from './util/logger';
import { redis } from './util/redis';
import { rendertron } from './util/rendertron';
import { url } from './util/url';

const requestAsync = promisify(request).bind(request);

export const handler = {
  handlePrerenderedRequest: async (proxySettings: ProxySettings, req: Request, res: Response): Promise<void> => {
    // TODO: Remove base= html tag from rendertron response.
    const urlToProxy = url.getUrlToProxyTo(req, proxySettings);
    const fullUrl = url.fullFromRequest(req);
    try {
      logger.info(`Rendering request for ${fullUrl} content with rendertron render ${urlToProxy}`);
      // TODO: implement caching;
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
      encoding: null,
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
    const hasAuthorization = restHeaders.authorization !== undefined;
    const shouldUseCachedResponse =
      isHtmlRequest &&
      originRequestParams.method === 'GET' ||
      originRequestParams.method === 'HEAD' &&
      !hasAuthorization;

    // TODO: add TTL
    if (shouldUseCachedResponse) {
      const isMobile = url.isMobileRequest(req);
      const acceptsCompressed = req.acceptsEncodings('gzip');
      const cachedResponseHeaderKey = `header_${isMobile}_${acceptsCompressed}_${urlToProxy}`;
      const cachedResponseBodyKey = `body_${isMobile}_${acceptsCompressed}_${urlToProxy}`;
      const [rawHeaders, rawCachedResponse] =
        await (redis as any).mgetBuffer(cachedResponseHeaderKey, cachedResponseBodyKey);
      if (!rawCachedResponse) {
        logger.info(`Proxying request for ${fullUrl} content from ${urlToProxy}`);
        req.pipe(
          request(originRequestParams),
        ).pipe(res);
        // populate cache for next time.
        const originResponse = await requestAsync(originRequestParams);
        const shouldCacheResponse =
          originResponse.statusCode === 200 &&
          originResponse.headers['set-cookie'] === undefined &&
          originRequestParams.headers['cache-control'] !== 'no-cache';
        if (shouldCacheResponse) {
          await redis.multi()
            .set(cachedResponseHeaderKey, JSON.stringify({
              'accept-ranges': originResponse.headers['accept-ranges'],
              'content-type': originResponse.headers['content-type'],
              'content-encoding': originResponse.headers['content-encoding'],
            }))
            .set(cachedResponseBodyKey, originResponse.body)
            .exec();
        }
        return;
      }
      logger.info(`Proxying request for ${fullUrl} content from cached ${urlToProxy} content`);
      const headers = JSON.parse(rawHeaders);
      res.set(headers).status(200).send(rawCachedResponse);
      return;
    }
    logger.info(`Proxying request for ${fullUrl} content from ${urlToProxy}`);
    req.pipe(
      request(originRequestParams),
    ).pipe(res);
  },
  root: async (req: Request, res: Response): Promise<void> => {
    // TODO: use better bot detection.
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
