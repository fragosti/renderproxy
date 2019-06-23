import { Request } from 'express';

import { ProxySettings } from '../types';

export const url = {
  fullFromRequest: (req: Request): string => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  },
  getFileType: (req: Request): string | undefined => {
    return (req.url.match( /\.([0-9a-z]+)(?:[\?#]|$)/i) || []).pop();
  },
  getUrlToProxyTo: (req: Request, proxySettings: ProxySettings) => {
    return `${proxySettings.proxyToUrl}${req.url.slice(1)}`;
  },
};
