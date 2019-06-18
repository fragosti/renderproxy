import { Request } from 'express';

export const url = {
  fullFromRequest: (req: Request): string => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  },
  getFileTypeFromRequest: (req: Request): string | undefined => {
    return (req.url.match( /\.([0-9a-z]+)(?:[\?#]|$)/i) || []).pop();
  },
};
