import { Firestore } from '@google-cloud/firestore';
import moment from 'moment';

import { ProxySettings } from '../types';
import { logger } from './logger';
import { redis } from './redis';

const db = new Firestore();

const proxySettingsCollection = db.collection('proxySettings');

export const database = {
  getProxySettingsAsync: async (domain: string): Promise<ProxySettings> => {
    const settingsDocSnap = await proxySettingsCollection.doc(domain).get();
    if (!settingsDocSnap.exists) {
      throw new Error(`Fetching ProxySetting for ${domain}`);
    }
    return settingsDocSnap.data() as ProxySettings;
  },
  trackUsageAsync: async (domain: string): Promise<void> => {
    const todayString = moment().format('YYYY-MM-DD');
    const trackingKey = `${domain}_${todayString}`;
    try {
      await redis.incrAsync(trackingKey);
    } catch (err) {
      logger.error(`Failed to INCR redis key ${trackingKey}`);
    }
  },
};
