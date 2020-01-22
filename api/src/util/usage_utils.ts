import * as R from 'ramda';

import { ObjectMap } from '../types';

export interface FormattedUsage {
  dailyUsage: ObjectMap<number>;
  monthlyUsage: ObjectMap<number>;
  totalUsage: number;
}

export const usageUtils = {
  formatDailyUsage: (dailyUsage: ObjectMap<number>): FormattedUsage => {
    const totalUsage = R.sum(Object.values(dailyUsage));
    const monthlyUsage = Object.keys(dailyUsage).reduce((acc, val) => {
      const month = val.split('-').slice(0, 2).join('-');
      const dayRequests = dailyUsage[val];
      acc[month] = acc[month] ? acc[month] + dayRequests : dayRequests;
      return acc;
    }, {});
    return {
      dailyUsage,
      monthlyUsage,
      totalUsage,
    };
  },
};
