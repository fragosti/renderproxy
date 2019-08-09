import { Firestore } from '@google-cloud/firestore';
import { firestore } from 'firebase-admin';

import { DatabaseUser, ProxySettings } from '../types';
import { logger } from './logger';

const db = new Firestore();

const proxySettingsCollection = db.collection('proxySettings');
const userCollection = db.collection('users');

export const database = {
  getItemAsync: async (domain: string): Promise<ProxySettings | undefined> => {
    const settingsDoc = await proxySettingsCollection.doc(domain).get();
    if (!settingsDoc.exists) {
      return undefined;
    }
    return settingsDoc.data() as ProxySettings;
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
  },
  getProxySettingsForUser: async (userId: string): Promise<ProxySettings[]> => {
    const userDocSnap = await userCollection.doc(userId).get();
    if (!userDocSnap.exists) {
      return [];
    }
    const userDomains: string[] = (await userDocSnap.data()).domains;
    const proxySettingsOrUndefined = await Promise.all(userDomains.map((domain) => database.getItemAsync(domain)));
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
    const userDoc = await userCollection.doc(userId);
    // Don't delete customerId since stripe does not delete them.
    await userDoc.update({ hasBillingInfo: false });
  },
  getUser: async (userId: string): Promise<DatabaseUser> => {
    const user = await userCollection.doc(userId).get();
    if (user.exists) {
      return (user.data() as DatabaseUser);
    }
    throw new Error(`Database request for user of id ${userId} failed`);
  },
};
