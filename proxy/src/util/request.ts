import { Request } from 'express';
import isBot from 'isbot';

import { requestTypesToRedirect } from '../constants';
import { ProxySettings } from '../types';

export const requestUtils = {
  fullFromRequest: (req: Request): string => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  },
  getFileType: (req: Request): string | undefined => {
    return (req.url.match( /\.([0-9a-z]+)(?:[\?#]|$)/i) || []).pop();
  },
  getUrlToProxyTo: (req: Request, proxySettings: ProxySettings) => {
    return `${proxySettings.urlToProxy}${req.url.slice(1)}`;
  },
  isHtmlRequest: (req: Request) => {
    const fileType = requestUtils.getFileType(req);
    return fileType === undefined || fileType === 'html';
  },
  isMobileRequest: (req: Request) => {
    const userAgent = req.headers['user-agent'];
    return /iPhone|iPad|iPod|Android/i.test(userAgent);
  },
  shouldRedirect: (req: Request, proxySettings: ProxySettings) => {
    const isHtmlRequest = requestUtils.isHtmlRequest(req);
    const fileType = requestUtils.getFileType(req);
    const { shouldRedirectIfPossible } = proxySettings;
    return !isHtmlRequest &&
      shouldRedirectIfPossible &&
      req.protocol === 'https' &&
      requestTypesToRedirect.has(fileType);
  },
  shouldPrerender: (req: Request, proxySettings: ProxySettings) => {
    if (req.get('should-render')) {
      return true;
    }
    const isHtmlRequest = requestUtils.isHtmlRequest(req);
    const isRequestFromBot = isBot(req.get('user-agent'));
    return isHtmlRequest &&
      proxySettings.prerenderSetting === 'all' ||
      (proxySettings.prerenderSetting === 'bot' && isRequestFromBot);
  },
};
