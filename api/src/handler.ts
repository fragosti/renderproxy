import { Request, Response } from 'express';

import { database } from './util/database';
import { logger } from './util/logger';
import { AuthorizedUser, ProxySettings } from './types'

export interface AuthorizedRequest extends Request {
  user: AuthorizedUser;
}

export const handler = {
  root: (req: Request, res: Response): void => {
    res.send('hello world');
  },
  postProxySetting: async (req: AuthorizedRequest, res: Response): Promise<void> => {
    const userId = req.user.sub;
    const { domain, urlToProxy } = req.body;
    // TODO: assert values are correct.
    // TODO: don't allow overwrites of other people.
    // TODO: keep a map of userId -> domain

    const existingProxySettings = await database.getItemAsync(domain);
    if (existingProxySettings && existingProxySettings.userId !== userId) {
      res.json({ status: ''})
    }    

    const proxySettings: ProxySettings = {
      urlToProxy,
      shouldRedirectIfPossible: true,
      prerenderSetting: 'none',
      userId,
    }
    try {
      await database.addUserDomainAsync(userId, domain);
      await database.addItemAsync(domain, proxySettings);
      logger.info(`User ${userId} successfully added proxy ${urlToProxy} for ${domain}`);
      res.json({ status: 'success' });
    } catch (err) {
      res.json({ status: 'failure', err });
      logger.error(`Failed to add proxy ${urlToProxy} for ${domain}`);
    }
  },
};
