import { Firestore } from '@google-cloud/firestore';

import { ProxySettings } from '../types';

const db = new Firestore();

const proxySettingsCollection = db.collection('proxySettings');

export const database = {
  getItemAsync: async (domain: string): Promise<ProxySettings> => {
    const settingsDoc = await proxySettingsCollection.doc(domain).get();
    if (!settingsDoc.exists) {
      throw new Error(`Fetching ProxySetting for ${domain}`);
    }
    return settingsDoc.data() as ProxySettings;
  },
};
