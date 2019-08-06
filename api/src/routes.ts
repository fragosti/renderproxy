import { Application, Request, Response } from 'express';
import { check } from 'express-validator';

import { checkJwt } from './middleware/jwt';
import { AuthorizedUser, ProxySettings } from './types';
import { database } from './util/database';
import { logger } from './util/logger';
import { stripe } from './util/stripe';

export interface AuthorizedRequest extends Request {
  user: AuthorizedUser;
}

export const apply = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.send('renderproxy API root');
  });
  app.post('/proxy_settings',
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
        logger.info(`${userId} failed adding ${domain}. It belongs to ${existingProxySettings.userId}`);
        res.status(400).json({ type: 'domain_claimed' });
        return;
      }

      const proxySettings: ProxySettings = {
        domain,
        urlToProxy,
        shouldRedirectIfPossible: true,
        prerenderSetting: 'none',
        userId,
      };
      try {
        await database.addProxySettingsForUser(userId, domain, proxySettings);
        logger.info(`User ${userId} successfully added proxy ${urlToProxy} for ${domain}`);
        res.status(201).json({ type: 'success', message: 'Successfully added domain.'});
      } catch (err) {
        res.status(500).json({ type: 'add_failure', message: err });
        logger.error(`Failed to add proxy ${urlToProxy} for ${domain}`);
      }
  });
  app.get('/proxy_settings', checkJwt, async (req: AuthorizedRequest, res: Response): Promise<void> => {
    const userId = req.user.sub;
    try {
      const userProxySettings = await database.getProxySettingsForUser(userId);
      const domains = userProxySettings.map((setting) => setting.domain).join(', ');
      logger.info(`Successfully got proxySettings [${domains}] for ${userId}`);
      res.status(200).json(userProxySettings);
    } catch (err) {
      logger.error(`Failed to get proxy settings for ${userId}`);
      res.status(500).json({ type: 'get_user_settings_failure', err: '' });
    }
  });
  app.get('/proxy_settings/:domain', checkJwt, async (req: AuthorizedRequest, res: Response): Promise<void> => {
    const userId = req.user.sub;
    const { domain } = req.params;
    try {
      const proxySettings = await database.getItemAsync(domain);
      if (!proxySettings || proxySettings.userId !== userId) {
        logger.info(`${userId} failed reading ${domain}. It belongs to ${proxySettings.userId}`);
        res.status(400).json({ type: 'not_allowed' });
      }
      logger.info(`${userId} successfully read settings for ${domain}`);
      res.status(200).json(proxySettings);
    } catch (err) {
      logger.error(`Failed to get proxy settings for ${userId}`);
      res.status(500).json({ type: 'get_user_settings_failure', message: err });
    }
  });
  app.delete('/proxy_settings/:domain', checkJwt, async (req: AuthorizedRequest, res: Response): Promise<void> => {
    const userId = req.user.sub;
    const { domain } = req.params;
    try {
      await database.deleteProxySettingsForUser(userId, domain);
      logger.info(`${userId} successfully deleted settings for ${domain}`);
      res.status(200).json({ type: 'delete_settings_success'});
    } catch (err) {
      logger.error(`Failed to delete ${domain} proxy settings for ${userId}`);
      res.status(500).json({ type: 'delete_settings_failure', message: err });
    }
  });
  app.post('/customer', [
    checkJwt,
    check('cardToken').exists(),
  ], async (req: AuthorizedRequest, res: Response): Promise<void> => {
    const { sub } = req.user;
    const { cardToken } = req.body;
    try {
      const customer = await stripe.customers.create({
        source: cardToken,
        metadata: {
          id: sub,
        },
      });
      logger.info(`Successfully create customer ${customer.id}`);
      await database.addCustomerIdToUser(sub, customer.id);
      logger.info(`Successfully created ${customer.id} entity for user ${sub}`);
      res.status(200).json({ type: 'create_customer_success' });
    } catch (err) {
      logger.error(`Failed to create customer for ${sub}`);
      res.status(500).json({ type: 'create_customer_failure', message: err });
    }
  });
  app.get('/customer', checkJwt, async (req: AuthorizedRequest, res: Response): Promise<void> => {
    const userId = req.user.sub;
    try {
      const user = await database.getUser(req.user.sub);
      let customer;
      if (user.customerId) {
        customer = await stripe.customers.retrieve(user.customerId);
      }
      logger.info(`Successfully read customer with id ${userId} and customer id ${customer.id}`);
      res.status(200).json({ customer });
    } catch (err) {
      logger.error(`Failed to read customer with id ${userId}`);
      res.status(500).json({ type: 'read_customer'});
    }
  });
};
