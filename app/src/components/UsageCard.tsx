import { Box, Divider, Paper } from '@material-ui/core';
import React, { useEffect } from 'react';

import { Text } from './Text';
import { UsageChart } from './UsageChart';

export interface UsageCardProps {
  domain: string;
}

export const UsageCard: React.FC<UsageCardProps> = props => {
  return (
    <Paper elevation={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" paddingY={2} paddingX={3}>
        <Text align="left" variant="h5" fontWeight="bold">
          Usage
        </Text>
      </Box>
      <Divider />
      <Box paddingY={1} paddingX={3}>
        <Box marginY={3}>
          <UsageChart domain={props.domain} />
        </Box>
      </Box>
    </Paper>
  );
};
