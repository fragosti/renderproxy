import { Box, Divider, Paper } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { useAuth0 } from '../util/Auth0';
import { Text } from './Text';
import { UsageChart } from './UsageChart';

import { UsageData } from '../types';

export interface UsageCardProps {
  domain: string;
}

export const UsageCard: React.FC<UsageCardProps> = props => {
  const { api } = useAuth0();
  const [usageData, setUsageData] = useState();
  useEffect(() => {
    const getUsageData = async () => {
      const data = await api.getUsageAsync(props.domain);
      setUsageData(data);
    };
    getUsageData();
  }, []);
  return (
    <Paper elevation={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" paddingY={2} paddingX={3}>
        <Text align="left" variant="h5" fontWeight="bold">
          Usage
        </Text>
      </Box>
      <Divider />
      <Box paddingY={1} paddingX={3}>
        <Box marginY={3}>{usageData && <UsageInfo usageData={usageData} />}</Box>
        <Box marginTop={4} marginBottom={2}>
          {usageData && <UsageChart usageData={usageData} />}
        </Box>
      </Box>
    </Paper>
  );
};

interface UsageInfoProps {
  usageData: UsageData;
}

const info = (label: string, value: number) => (
  <Box>
    <Text display={'inline' as any} color={'textSecondary' as any}>
      {label}:
    </Text>
    <Text display={'inline' as any} variant="h5">
      {value} requests
    </Text>
  </Box>
);
const UsageInfo: React.FC<UsageInfoProps> = ({ usageData }) => {
  const currentMonth = moment();
  const previousMonth = moment().subtract(1, 'month');
  const currentMonthName = currentMonth.format('MMMM');
  const previousMonthName = previousMonth.format('MMMM');
  const currentMonthKey = currentMonth.format('YYYY-MM');
  const previousMonthKey = previousMonth.format('YYYY-MM');
  const requestsCurrentMonth = usageData.monthlyUsage[currentMonthKey] || 0;
  const requestsPreviousMonth = usageData.monthlyUsage[previousMonthKey] || 0;
  return (
    <Box display="flex" justifyContent="space-around">
      {info('Past 30 days', usageData.totalUsage)}
      {info(currentMonthName, requestsCurrentMonth)}
      {info(previousMonthName, requestsPreviousMonth)}
    </Box>
  );
};
