import { ObjectMap, PlanId, SubscriptionTierInfo } from './types';

export const AUTH0_DOMAIN = 'renderproxy.auth0.com';
export const AUTH0_CLIENT_ID = 'ZgLSqr5Q2cgUhgWKDRZrhz9YPRWDM1Ag';
export const AUTH0_AUDIENCE = 'https://api.renderproxy.com';
export const API_ENDPOINT =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://api.renderproxy.com';
export const RETURN_TO_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://renderproxy.com';
export const HOMEPAGE_TITLE = 'Home';
export const STRIPE_PUBLIC_KEY =
  process.env.NODE_ENV === 'development'
    ? 'pk_test_a3HL1b2vANClXKfrB05OySs000dF8F2LLM'
    : 'pk_live_EHJOyKGGdURSBHb4g2AQZTt900AIZ0ORmD';
export const subscriptionTiers: SubscriptionTierInfo[] = [
  {
    id: PlanId.Spark,
    name: 'Spark',
    price: '$0',
    properties: ['1,000 requests / month', 'Free TLS certificates', 'Bot-only pre-rendering', 'Unlimited pages'],
    ctaText: 'Select',
  },
  {
    id: PlanId.Flame,
    name: 'Flame',
    price: '$10 / month',
    properties: ['100,000 requests / month', 'Free TLS certificates', 'Bot-only pre-rendering', 'Unlimited pages'],
    ctaText: 'Select',
  },
  {
    id: PlanId.Fire,
    name: 'Fire',
    price: '$50 / month',
    properties: ['10,00,000 requests / month', 'Free TLS certificates', 'Pre-render every request', 'Unlimited pages'],
    ctaText: 'Select',
  },
  {
    id: PlanId.Metered,
    name: 'Metered',
    price: 'Contact Us',
    properties: ['Unlimited requests / month', 'Free TLS certiciates', 'Unlimited pages'],
    ctaText: 'Contact',
  },
];

export const subscriptionTierInfoMap: ObjectMap<SubscriptionTierInfo> = subscriptionTiers.reduce(
  (acc: ObjectMap<SubscriptionTierInfo>, sub) => {
    acc[sub.id] = sub;
    return acc;
  },
  {},
);
