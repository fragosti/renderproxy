import { Box, Divider, Paper } from '@material-ui/core';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import Stripe from 'stripe';

import { subscriptionTiers } from '../constants';
import { useFetchCustomerAsync } from '../hooks/useFetchCustomerAsync';
import { FetchingState, PlanId } from '../types';
import { SubscriptionTier } from './SubscriptionTier';
import { Text } from './Text';

export interface SubscriptionCardProps {
  domain: string;
}

const getPlanId = (
  customer: Stripe.customers.ICustomer | undefined,
  domain: string,
  fetchingState: FetchingState,
): PlanId | undefined => {
  if (fetchingState !== 'success') {
    return undefined;
  }
  if (!customer || !customer.subscriptions) {
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
  const [customer, fetchCustomerAsync, fetchingState] = useFetchCustomerAsync();
  useEffect(() => {
    fetchCustomerAsync();
  }, [fetchCustomerAsync]);
  const planId = getPlanId(customer, domain, fetchingState);
  const requiresBillingInfo = !customer || !customer.sources;
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
          <SubscriptionTier
            key={tier.name}
            domain={domain}
            onSubscriptionChange={fetchCustomerAsync}
            isActive={tier.id === planId}
            requiresBillingInfo={requiresBillingInfo}
            {...tier}
          />
        ))}
      </Box>
    </Paper>
  );
};
