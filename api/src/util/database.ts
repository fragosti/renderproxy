import { Firestore } from '@google-cloud/firestore';
import { firestore } from 'firebase-admin';

import { ProxySettings } from '../types';

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
  addItemAsync: async (domain: string, settings: ProxySettings): Promise<void> => {
    await proxySettingsCollection.doc(domain).set(settings);
  },
  addUserDomainAsync: async (userId: string, domain: string): Promise<void> => {
    const userDoc = await userCollection.doc(userId).get();
    if (userDoc.exists) {
      await userCollection.doc(userId).update({
        domains: firestore.FieldValue.arrayUnion(domain),
      });
    } else {
      await userCollection.doc(userId).set({
        domains: [domain],
      });
    }
  },
};
