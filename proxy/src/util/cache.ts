import { Request } from 'express';
import { Response } from 'request';

import { ProxySettings } from '../types';
import { requestUtils } from './request';

export const cacheUtils = {
  getBodyCacheKey: (req: Request, proxySettings: ProxySettings, isPrerendered: boolean): string => {
    return cacheUtils.getCacheKey('body', req, proxySettings, isPrerendered);
  },
  getHeaderCacheKey: (req: Request, proxySettings: ProxySettings, isPrerendered: boolean): string => {
    return cacheUtils.getCacheKey('header', req, proxySettings, isPrerendered);
  },
  getCacheKey: (namespace: string, req: Request, proxySettings: ProxySettings, isPrerendered: boolean): string => {
    const isMobile = requestUtils.isMobileRequest(req);
    const urlToProxy = requestUtils.getUrlToProxyTo(req, proxySettings);
    const acceptsCompressed = req.acceptsEncodings('gzip');
    return `${namespace}(${isMobile}, ${isPrerendered}, ${acceptsCompressed}):${urlToProxy}`;
  },
  shouldCacheResponse: (req: Request, originResponse: Response): boolean => {
    return originResponse.statusCode === 200 &&
      originResponse.headers['set-cookie'] === undefined &&
      req.headers['cache-control'] !== 'no-cache' &&
      requestUtils.isHtmlRequest(req);
  },
  shouldUseCachedResponse: (req: Request): boolean => {
    const isHtmlRequest = requestUtils.isHtmlRequest(req);
    const hasAuthorization = req.headers.authorization !== undefined;
    return isHtmlRequest &&
    req.method === 'GET' ||
    req.method === 'HEAD' &&
    !hasAuthorization;
  },
};
