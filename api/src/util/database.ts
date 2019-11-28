import { FieldValue, Firestore } from '@google-cloud/firestore';
import { firestore } from 'firebase-admin';
import moment from 'moment';
import * as R from 'ramda';

import { DatabaseUser, ObjectMap, ProxySettings } from '../types';
import { logger } from './logger';
import { redis } from './redis';

const db = new Firestore();

const proxySettingsCollection = db.collection('proxySettings');
const userCollection = db.collection('users');

export const database = {
  getProxySettingsAsync: async (domain: string): Promise<ProxySettings | undefined> => {
    const settingsDocSnap = await proxySettingsCollection.doc(domain).get();
    if (!settingsDocSnap.exists) {
      return undefined;
    }
    return settingsDocSnap.data() as ProxySettings;
  },
  deleteProxySettingsForUser: async (userId: string, domain: string): Promise<void> => {
    const proxySettingsDoc = proxySettingsCollection.doc(domain);
    const userDoc = userCollection.doc(userId);
    const batch = db.batch();
    batch.delete(proxySettingsDoc);
    batch.update(userDoc, {
      domains: firestore.FieldValue.arrayRemove(domain),
    });
    await batch.commit();
  },
  addProxySettingsForUser: async (userId: string, domain: string, settings: ProxySettings): Promise<void> => {
    const proxySettingsDoc = proxySettingsCollection.doc(domain);
    const userDoc = userCollection.doc(userId);
    const user = await userDoc.get();
    const batch = db.batch();
    batch.set(proxySettingsDoc, settings);
    if (user.exists) {
      batch.update(userDoc, {
        domains: firestore.FieldValue.arrayUnion(domain),
      });
    } else {
      batch.set(userDoc, {
        domains: [domain],
      });
    }
    await batch.commit();
    redis.set(`${domain}_proxy-settings`, JSON.stringify(settings));
  },
  getProxySettingsForUser: async (userId: string): Promise<ProxySettings[]> => {
    const userDocSnap = await userCollection.doc(userId).get();
    if (!userDocSnap.exists) {
      return [];
    }
    const userDomains: string[] = (await userDocSnap.data()).domains;
    const proxySettingsOrUndefined = await Promise.all(
      userDomains.map((domain) => database.getProxySettingsAsync(domain)),
    );
    proxySettingsOrUndefined.forEach((proxySettings: ProxySettings | undefined, index: number) => {
      if (proxySettings === undefined) {
        logger.error(`Could not find a setting for domain ${userDomains[index]}`);
      }
    });
    // Filter out undefined values;
    return proxySettingsOrUndefined.filter((setting) => setting);
  },
  addCustomerToUser: async (userId: string, customerId: string): Promise<void> => {
    const userDoc = await userCollection.doc(userId);
    await userDoc.update({ customerId, hasBillingInfo: true });
  },
  removeCustomerFromUser: async (userId: string): Promise<void> => {
    const userDoc = userCollection.doc(userId);
    const userDocSnap = await userDoc.get();
    const userDomains: string[] = (await userDocSnap.data()).domains;
    const batch = db.batch();
    // Don't delete customerId since stripe does not delete them.
    batch.update(userDoc, { hasBillingInfo: false });
    // Remove subscriptionId from all domains
    for (const domain of userDomains) {
      const proxySettingsDoc = proxySettingsCollection.doc(domain);
      batch.update(proxySettingsDoc, {
        subscriptionId: FieldValue.delete(),
      });
    }
    await batch.commit();
  },
  addSubscriptionIdToDomain: async (domain: string, subscriptionId: string): Promise<void> => {
    const proxySettingsDoc = proxySettingsCollection.doc(domain);
    await proxySettingsDoc.update({ subscriptionId });
  },
  removeSubscriptionIdFromDomain: async (domain: string): Promise<void> => {
    const proxySettingsDoc = proxySettingsCollection.doc(domain);
    await proxySettingsDoc.update({
      subscriptionId: FieldValue.delete(),
    });
  },
  getUserOrCreate: async (userId: string): Promise<DatabaseUser> => {
    const userDoc = userCollection.doc(userId);
    const userDocSnap = await userDoc.get();
    if (userDocSnap.exists) {
      return (userDocSnap.data() as DatabaseUser);
    } else {
      const newUser: DatabaseUser = {
        domains: [],
      };
      await userDoc.set(newUser);
      return newUser;
    }
  },
  getUsage: async (domain: string, days: number = 30): Promise<ObjectMap<number>> => {
    const dates = R.range(0, days).map((daysAgo) => moment().subtract(daysAgo, 'days').format('YYYY-MM-DD'));
    const redisUsageKeys = dates.map((date) => `${domain}_${date}`);
    const usage = await redis.mget(...redisUsageKeys);
    return dates.reduce((acc, val, index) => {
      acc[val] = parseInt(usage[index], 10) || 0;
      return acc;
    }, {});
  },
  clearWebCache: async (domain: string): Promise<void> => {
    const proxySettings = await database.getProxySettingsAsync(domain);
    const keysToDelete = await redis.keys(`*:${proxySettings.urlToProxy}`);
    if (keysToDelete.length) {
      await redis.del(...keysToDelete);
    }
  },
};
