import { Application, Request, Response } from 'express';
import { check } from 'express-validator';

import { checkJwt } from './middleware/jwt';
import { AuthorizedUser, ProxySettings } from './types';
import { database } from './util/database';
import { logger } from './util/logger';

export interface AuthorizedRequest extends Request {
  user: AuthorizedUser;
}

export const apply = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.send('renderproxy API root');
  });
  app.post('/proxy_setting',
    [
      checkJwt,
      check('domain').exists(),
      check('urlToProxy').exists(),
    ],
    async (req: AuthorizedRequest, res: Response): Promise<void> => {
      const userId = req.user.sub;
      const { domain, urlToProxy } = req.body;
      const existingProxySettings = await database.getItemAsync(domain);
      if (existingProxySettings && existingProxySettings.userId !== userId) {
        res.status(400).json({ type: 'domain_claimed' });
      }

      const proxySettings: ProxySettings = {
        urlToProxy,
        shouldRedirectIfPossible: true,
        prerenderSetting: 'none',
        userId,
      };
      try {
        await database.addUserDomainAsync(userId, domain);
        await database.addItemAsync(domain, proxySettings);
        logger.info(`User ${userId} successfully added proxy ${urlToProxy} for ${domain}`);
        res.status(201);
      } catch (err) {
        res.status(500).json({ type: 'add_failure', err });
        logger.error(`Failed to add proxy ${urlToProxy} for ${domain}`);
      }
  });
};
