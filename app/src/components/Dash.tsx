import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import React, { useState } from 'react';
import { Link as RouterLink, RouteComponentProps } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';

import { BreadCrumbs } from '../components/BreadCrumbs';
import { HOMEPAGE_TITLE } from '../constants';
import { useUserProxySettings } from '../hooks/useUserProxySettings';
import { AddProxyDialog } from './AddProxyDialog';
import { BillingCard } from './BillingCard';
import { Link } from './Link';
import { Text } from './Text';

export type DashProps = RouteComponentProps;

const useStyles = makeStyles({
  root: {
    textOverflow: 'ellipsis',
    maxWidth: '500px',
    overflow: 'hidden',
    position: 'relative',
    top: '3px',
  },
});

export const Dash: React.FC<DashProps> = props => {
  const [userProxySettings, didError] = useUserProxySettings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const closeDialog = () => setIsDialogOpen(false);
  const openDialog = () => setIsDialogOpen(true);
  const handleSuccessfulAdd = (domain: string) => {
    closeDialog();
    props.history.push(`/edit/${domain}`);
  };
  const styles = useStyles();
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
            <Box display="flex" justifyContent="space-between" alignItems="center" paddingY={2} paddingX={3}>
              <Text align="left" variant="h5" fontWeight="bold">
                Domains
              </Text>
              <Button variant="contained" color="primary" style={{ color: 'white' }} onClick={openDialog}>
                Add
                <AddIcon style={{ left: '3px', position: 'relative' }} />
              </Button>
            </Box>
            {didError ? (
              <>
                <Divider />
                <Box display="flex" paddingY={2} alignItems="center" justifyContent="center" flexWrap="wrap">
                  <Text>Something went wrong. Please try refreshing or coming back later.</Text>
                </Box>
              </>
            ) : !userProxySettings ? (
              <>
                <Divider />
                <Box display="flex" paddingY={2} alignItems="center" justifyContent="center">
                  <CircularProgress color="secondary" />
                </Box>
              </>
            ) : (
              userProxySettings.map(settings => (
                <Box key={settings.domain}>
                  <Divider />
                  <Box display="flex" justifyContent="space-between" paddingY={1} paddingX={3} flexWrap="wrap">
                    <Box key={settings.domain} display="flex" alignItems="center" flexWrap="wrap">
                      <Typography>
                        <Link href={`http://${settings.domain}`} fontSize={18} fontWeight="bold">
                          {settings.domain}
                        </Link>
                      </Typography>
                      <Box marginX={2} marginTop={1}>
                        <ArrowForwardIcon />
                      </Box>
                      <Typography noWrap={true}>
                        <Link href={settings.urlToProxy || undefined} fontSize={18} classes={styles}>
                          {settings.urlToProxy || <i>The origin URL has not been set.</i>}
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
              ))
            )}
          </Paper>
        </Box>
        <Box marginTop={3}>
          <Elements>
            <BillingCard />
          </Elements>
        </Box>
      </Container>
      <AddProxyDialog onSuccess={handleSuccessfulAdd} open={isDialogOpen} onClose={closeDialog} />
    </>
  );
};
