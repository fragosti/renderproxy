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
  addProxySettingsForUser: async (userId: string, domain: string, settings: ProxySettings): Promise<void> => {
    const proxySettingsDoc = proxySettingsCollection.doc(domain);
    const userDoc = userCollection.doc(userId);
    const user = await userCollection.doc(userId).get();
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
};
