import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import './App.css';
import { Dash } from './components/Dash';
import { EditProxySettings } from './components/EditProxySettings';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './constants';
import { theme } from './style/theme';
import { Auth0Provider } from './util/Auth0';

const onRedirectCallback = (appState: any) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl ? appState.targetUrl : window.location.pathname,
  );
};

export const App: React.FC = () => {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      client_id={AUTH0_CLIENT_ID}
      redirect_uri={window.location.origin}
      audience={AUTH0_AUDIENCE}
      onRedirectCallback={onRedirectCallback}
    >
      <ThemeProvider theme={theme}>
        <div>
          <BrowserRouter>
            <header>
              <Navbar />
            </header>
            <Switch>
              <PrivateRoute exact={true} path="/" Component={Dash as any} />
              <PrivateRoute path="/edit/:domain" Component={EditProxySettings as any} />
            </Switch>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </Auth0Provider>
  );
};
