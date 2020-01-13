import { Request, Response } from 'express';
import isMobile from 'is-mobile';
import request from 'request';
import { promisify } from 'util';

import { ProxySettings, PrerenderSetting } from './types';
import { cacheUtils } from './util/cache';
import { database } from './util/database';
import { logger } from './util/logger';
import { redis } from './util/redis';
import { rendertron } from './util/rendertron';
import { requestUtils } from './util/request';

const requestAsync = promisify(request).bind(request);

export const handler = {
  handlePrerenderedRequest: async (proxySettings: ProxySettings, req: Request, res: Response): Promise<void> => {
    const urlToProxy = requestUtils.getUrlToProxyTo(req, proxySettings);
    const fullUrl = requestUtils.fullFromRequest(req);
    try {
      const cachedResponseBodyKey = cacheUtils.getBodyCacheKey(req, proxySettings, true);
      const cachedResponse = await redis.get(cachedResponseBodyKey);
      if (!cachedResponse || requestUtils.shouldSkipCache(req)) {
        logger.info(`Rendering request for ${fullUrl} content with rendertron render ${urlToProxy}`);
        const response = await rendertron.render(urlToProxy, (isMobile as any)({ ua: req }));
        res.send(response);
        redis.set(cachedResponseBodyKey, response, 'EX', proxySettings.cacheExpirySeconds);
        return;
      }
      logger.info(`Rendering request for ${fullUrl} content with cached rendertron render ${urlToProxy}`);
      if (proxySettings.prerenderSetting === 'bot') {
        res.vary('User-Agent');
      }
      res.send(cachedResponse);
    } catch (err) {
      logger.error(err);
      // Just proxy the regular page if we cannot get a pre-rendered one.
      return handler.handleRegularRequest(proxySettings, req, res);
    }
  },
  handleRegularRequest: async (proxySettings: ProxySettings, req: Request, res: Response): Promise<void> => {
    const urlToProxy = requestUtils.getUrlToProxyTo(req, proxySettings);
    const fullUrl = requestUtils.fullFromRequest(req);
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
      requestUtils.shouldRedirect(req, proxySettings)
    ) {
      logger.info(`Redirecting ${fullUrl} to ${urlToProxy}`);
      return res.redirect(urlToProxy);
    }
    if (proxySettings.prerenderSetting === 'bot') {
      res.vary('User-Agent');
    }
    if (cacheUtils.shouldUseCachedResponse(req)) {
      const cachedResponseHeaderKey = cacheUtils.getHeaderCacheKey(req, proxySettings, false);
      const cachedResponseBodyKey = cacheUtils.getBodyCacheKey(req, proxySettings, false);
      const [rawHeaders, rawCachedResponse] =
        await (redis as any).mgetBuffer(cachedResponseHeaderKey, cachedResponseBodyKey);
      if (!rawCachedResponse || requestUtils.shouldSkipCache(req)) {
        logger.info(`Proxying request for ${fullUrl} content from ${urlToProxy}`);
        req.pipe(
          request(originRequestParams),
        ).pipe(res);
        // populate cache for next time.
        const originResponse = await requestAsync(originRequestParams);
        if (cacheUtils.shouldCacheResponse(req, originResponse)) {
          await redis.multi()
            .set(cachedResponseHeaderKey, JSON.stringify({
              'accept-ranges': originResponse.headers['accept-ranges'],
              'content-type': originResponse.headers['content-type'],
              'content-encoding': originResponse.headers['content-encoding'],
            }), 'EX', proxySettings.cacheExpirySeconds)
            .set(cachedResponseBodyKey, originResponse.body, 'EX', proxySettings.cacheExpirySeconds)
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
    const host = req.get('host');
    let domain = host;
    if (domain.includes('.renderproxy.com')) {
      domain = domain.split('.').slice(0, -2).join('.');
    }
    database.trackUsageAsync(domain);
    try {
      const proxySettings = await database.getProxySettingsAsync(domain);
      if (!proxySettings.urlToProxy) {
        logger.info(`No origin URL found for ${domain}`);
        res.send(`Could not find an origin URL for ${domain}.`);
        return;
      }
      if (requestUtils.shouldPrerender(req, proxySettings)) {
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
