import * as R from 'ramda';
import Stripe from 'stripe';

import { PlanId, ProxySettings } from '../types';

type Customer = Stripe.customers.ICustomer;

export const planUtils = {
  getPlanId: (
    domain: string,
    customer?: Customer | undefined,
  ): PlanId | undefined => {
    if (!customer || !customer.subscriptions) {
      return PlanId.Free;
    }
    const subscriptions = customer.subscriptions.data;
    if (subscriptions.length > 0) {
      const subscriptionForThisDomain = subscriptions.filter((sub) => sub.metadata.domain === domain);
      const subscription = R.head(subscriptionForThisDomain);
      if (subscription) {
        if (subscription.plan) {
          return subscription.plan.id as PlanId;
        } else if (subscription.items.data) {
          const plan = R.head(subscription.items.data.sort((p1, p2) => p2.created - p1.created)).plan;
          return plan.id as PlanId;
        }
      }
      return PlanId.Free;
    }
    return PlanId.Free;
  },
  isValidProxySettingsForPlan: (proxySettings: ProxySettings, planId: PlanId) => {
    if ((planId === PlanId.Free || planId === PlanId.Spark) && proxySettings.prerenderSetting !== 'none') {
      return false;
    }
    if (planId === PlanId.Flame && proxySettings.prerenderSetting === 'all') {
      return false;
    }
    return true;
  },
  isValidProxySettingsForCustomer: (proxySettings: ProxySettings, customer?: Customer) => {
    const planId = planUtils.getPlanId(proxySettings.domain, customer);
    return planUtils.isValidProxySettingsForPlan(proxySettings, planId);
  },
  adjustProxySettingsForPlan: (proxySettings: ProxySettings, planId): ProxySettings => {
    if (planId === PlanId.Free || planId === PlanId.Spark) {
      return {
        ...proxySettings,
        prerenderSetting: 'none',
      };
    }
    if (planId === PlanId.Flame && proxySettings.prerenderSetting === 'all') {
      return {
        ...proxySettings,
        prerenderSetting: 'bot',
      };
    }
    return proxySettings;
  },
};
