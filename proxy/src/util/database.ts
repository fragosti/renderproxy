import { Firestore } from '@google-cloud/firestore';
import moment from 'moment';

import { ProxySettings } from '../types';
import { logger } from './logger';
import { redis } from './redis';

const db = new Firestore();

const proxySettingsCollection = db.collection('proxySettings');

export const database = {
  getProxySettingsAsync: async (domain: string): Promise<ProxySettings> => {
    const settingsKey = `${domain}_proxy-settings`;
    const cachedSettings = await redis.get(settingsKey);
    if (!cachedSettings) {
      const settingsDocSnap = await proxySettingsCollection.doc(domain).get();
      if (!settingsDocSnap.exists) {
        throw new Error(`Fetching ProxySetting for ${domain}`);
      }
      const proxySettings = settingsDocSnap.data() as ProxySettings;
      redis.set(settingsKey, JSON.stringify(proxySettings));
      return proxySettings;
    }
    return JSON.parse(cachedSettings);
  },
  trackUsageAsync: async (domain: string): Promise<void> => {
    const todayString = moment().format('YYYY-MM-DD');
    const trackingKey = `${domain}_${todayString}`;
    try {
      await redis.incr(trackingKey);
    } catch (err) {
      logger.error(`Failed to INCR redis key ${trackingKey}`);
    }
  },
};
