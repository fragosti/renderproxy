import { Box, Container, Divider, IconButton, Link, Paper, Tooltip, Typography } from '@material-ui/core';
import { ArrowForward as ArrowForwardIcon, Settings as SettingsIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';

import { useUserProxySettings } from '../hooks/useUserProxySettings';
import { ProxySettings } from '../types';

// api.addNewProxySettingsAsync({
//   domain: 'googles.com',
//   urlToProxy: 'https://www.nytimes.com/',
//   shouldRedirectIfPossible: false,
//   prerenderSetting: 'none',
// });

export const Dash: React.StatelessComponent = () => {
  const userProxySettings = useUserProxySettings();

  return (
    <Container maxWidth="md">
      <Typography align="left" variant="h3">
        <Box marginY={4} display="flex" fontWeight="bold" justifyContent="space-between">
          Proxied Sites
        </Box>
      </Typography>
      <Box>
        <Paper elevation={1}>
          {userProxySettings.map((settings, index) => (
            <>
              <Box display="flex" justifyContent="space-between" key={settings.domain} paddingY={2} paddingX={3}>
                <Box key={settings.domain} display="flex" alignItems="center">
                  <Typography>
                    <Link href={settings.domain} target="_blank" color="inherit">
                      <Box fontWeight="bold" fontFamily="Monospace" fontSize={18}>
                        {settings.domain}
                      </Box>
                    </Link>
                  </Typography>
                  <Box marginX={2} marginTop={1}>
                    <ArrowForwardIcon />
                  </Box>
                  <Typography>
                    <Link href={settings.urlToProxy} target="_blank" color="inherit">
                      <Box fontFamily="Monospace" fontSize={18}>
                        {settings.urlToProxy}
                      </Box>
                    </Link>
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title="Configure">
                    <IconButton>
                      <SettingsIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              {index + 1 !== userProxySettings.length && <Divider />}
            </>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};