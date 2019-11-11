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
    return `${proxySettings.urlToProxy}${req.url.slice(1)}`;
  },
  isHtmlRequest: (req: Request) => {
    const fileType = url.getFileType(req);
    return fileType === undefined || fileType === 'html';
  },
  isMobileRequest: (req: Request) => {
    const userAgent = req.headers['user-agent'];
    return /iPhone|iPad|iPod|Android/i.test(userAgent);
  },
};
