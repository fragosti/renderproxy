import { Box, Divider, Paper } from '@material-ui/core';
import * as R from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import Stripe from 'stripe';

import { subscriptionTiers } from '../constants';
import { PlanId } from '../types';
import { useAuth0 } from '../util/Auth0';
import { SubscriptionTier } from './SubscriptionTier';
import { Text } from './Text';

export type FetchingState = 'progress' | 'success' | 'failure';

export interface SubscriptionCardProps {
  domain: string;
}

const getPlanId = (customer: Stripe.customers.ICustomer | undefined, domain: string): PlanId | undefined => {
  if (!customer) {
    return undefined;
  }
  if (!customer.subscriptions) {
    return PlanId.Free;
  }
  const subscriptions = customer.subscriptions.data;
  if (subscriptions.length > 0) {
    const subscriptionForThisDomain = subscriptions.filter(sub => sub.metadata.domain === domain);
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
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ domain }) => {
  const { api } = useAuth0();
  const [customer, setCustomer] = useState<Stripe.customers.ICustomer | undefined>();
  const [fetchingState, setFetchingState] = useState<FetchingState>('progress');
  const fetchCustomerAsync = useCallback(async () => {
    setFetchingState('progress');
    try {
      const customerResponse = await api.getCustomerAsync();
      setCustomer(customerResponse.customer);
      setFetchingState('success');
    } catch (err) {
      console.error(err);
      setFetchingState('failure');
    }
  }, [api]);
  useEffect(() => {
    fetchCustomerAsync();
  }, [fetchCustomerAsync]);
  const planId = getPlanId(customer, domain);
  return (
    <Paper elevation={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" paddingY={2} paddingX={3}>
        <Text align="left" variant="h5" fontWeight="bold">
          Plan
        </Text>
      </Box>
      <Divider />
      <Box paddingY={1} paddingX={3} display="flex" justifyContent="space-between">
        {subscriptionTiers.map(tier => (
          <SubscriptionTier key={tier.id} domain={domain} isActive={tier.id === planId} {...tier} />
        ))}
      </Box>
    </Paper>
  );
};
