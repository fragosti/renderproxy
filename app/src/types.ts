import Stripe from 'stripe';

export type PrerenderSetting = 'none' | 'all' | 'bot';

export interface ProxySettings {
  domain: string;
  urlToProxy: string;
  shouldRedirectIfPossible: boolean;
  prerenderSetting: PrerenderSetting;
}

export interface ObjectMap<T> {
  [key: string]: T | undefined;
}

export interface MessageStruct {
  variant: 'success' | 'error';
  message: string;
}

export type Message = MessageStruct | undefined;

export type MessageResetter = () => void;

export type LoadingStatus = boolean;

export interface GetCustomerResponse {
  customer?: Stripe.customers.ICustomer;
}

export interface StripeCard {
  brand: string;
  funding: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

export enum PlanId {
  Free = 'free',
  Starter = 'starter',
  Pro = 'pro',
  Metered = 'metered',
}

export interface SubscriptionTierInfo {
  id: PlanId;
  name: string;
  price: string;
  properties: string[];
  ctaText?: string;
}

export type FetchingState = 'progress' | 'success' | 'failure';
