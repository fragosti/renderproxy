import { Box, Button, Container, Divider, IconButton, Paper, Tooltip, Typography } from '@material-ui/core';
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import React, { useState } from 'react';
import { Link as RouterLink, RouteComponentProps } from 'react-router-dom';

import { BreadCrumbs } from '../components/BreadCrumbs';
import { HOMEPAGE_TITLE } from '../constants';
import { useUserProxySettings } from '../hooks/useUserProxySettings';
import { AddProxyDialog } from './AddProxyDialog';
import { Link } from './Link';
import { Text } from './Text';

export type DashProps = RouteComponentProps;

export const Dash: React.FC<DashProps> = props => {
  const userProxySettings = useUserProxySettings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);
  const handleSuccessfulAdd = (domain: string) => {
    closeDialog();
    props.history.push(`/edit/${domain}`);
  };
  return (
    <>
      <Container maxWidth="md">
        <Box marginTop={3}>
          <BreadCrumbs
            crumbs={[
              {
                Icon: HomeIcon,
                text: HOMEPAGE_TITLE,
              },
            ]}
          />
        </Box>
        <Box marginY={3}>
          <Paper elevation={1}>
            <Box display="flex" justifyContent="space-between" paddingY={2} paddingX={3}>
              <Text align="left" variant="h5" fontWeight="bold">
                Proxied Sites
              </Text>
              <Button variant="contained" color="primary" style={{ color: 'white' }} onClick={openDialog}>
                Add
                <AddIcon style={{ left: '3px', position: 'relative' }} />
              </Button>
            </Box>
            {userProxySettings.map(settings => (
              <Box key={settings.domain}>
                <Divider />
                <Box display="flex" justifyContent="space-between" paddingY={1} paddingX={3}>
                  <Box key={settings.domain} display="flex" alignItems="center">
                    <Typography>
                      <Link href={`http://${settings.domain}`} fontSize={18} fontWeight="bold">
                        {settings.domain}
                      </Link>
                    </Typography>
                    <Box marginX={2} marginTop={1}>
                      <ArrowForwardIcon />
                    </Box>
                    <Typography>
                      <Link href={settings.urlToProxy} fontSize={18}>
                        {settings.urlToProxy}
                      </Link>
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title="Configure">
                      <RouterLink to={`edit/${settings.domain}`}>
                        <IconButton>
                          <SettingsIcon fontSize="large" />
                        </IconButton>
                      </RouterLink>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      </Container>
      <AddProxyDialog onSuccess={handleSuccessfulAdd} open={isDialogOpen} onClose={closeDialog} />
    </>
  );
};
