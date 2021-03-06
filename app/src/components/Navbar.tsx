import { AppBar, Avatar, Box, Grid, IconButton, Toolbar, Tooltip } from '@material-ui/core';
import { Input as InputIcon } from '@material-ui/icons';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Logo } from '../components/Logo';
import { RETURN_TO_URL } from '../constants';
import { useAuth0 } from '../util/Auth0';
import { Text } from './Text';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth0();
  const handleLogoutClick = () => logout({ returnTo: RETURN_TO_URL });
  return (
    <AppBar color="secondary" position="static">
      <Toolbar>
        <Grid container={true} spacing={3} justify="space-between" alignItems="center">
          <RouterLink to="/">
            <Box ml={{ xs: 6, md: 10 }} p={{ xs: 4, md: 4 }} pb={{ xs: 2 }}>
              <Logo height={36} />
            </Box>
          </RouterLink>
          <Box display="flex" alignItems="center" py={2}>
            {user && (
              <Text mr={2} fontSize={15} fontWeight="fontWeightBold" fontFamily="Monospace" component="span">
                {user.email || user.nickname}
              </Text>
            )}
            {user && (
              <Box mr={3} width={30}>
                <Avatar alt={user.name} src={user.picture} />
              </Box>
            )}
            <Tooltip title="Log Out">
              <IconButton color="inherit" size="medium" onClick={handleLogoutClick}>
                <InputIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
