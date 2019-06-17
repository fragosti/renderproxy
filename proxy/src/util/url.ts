import { Request } from 'express';

export const url = {
  fullFromRequest: (req: Request): string => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  },
};
