import { Request, Response } from 'express';

import { database } from './util/database';
import { logger } from './util/logger';
import { ProxySettings, PrerenderSetting } from './types'
import { url } from 'inspector';

export const handler = {
  root: (req: Request, res: Response): void => {
    res.send('hello world');
  },
  postProxySetting: async (req: Request, res: Response): Promise<void> => {
    const { domain, urlToProxy } = req.body;
    // TODO: assert values are correct.
    // TODO: don't allow overwrites of other people.
    const proxySettings: ProxySettings = {
      proxyToUrl: urlToProxy,
      shouldRedirectIfPossible: true,
      prerenderSetting: 'none',
    }
    try {
      await database.addItemAsync(domain, proxySettings);
      logger.info(`Successfully added proxy ${urlToProxy} for ${domain}`);
      res.json({ status: 'success' });
    } catch (err) {
      res.json({ status: 'failure', err });
      logger.error(`Failed to add proxy ${urlToProxy} for ${domain}`);
    }
  },
};
