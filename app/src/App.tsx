import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import { Profile } from './components/Profile';
import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './constants';
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
      <div className='App'>
        <BrowserRouter>
          <header>
            <Navbar />
          </header>
          <Switch>
            <Route path='/' exact={true} />
            <PrivateRoute path='/profile' Component={Profile} />
          </Switch>
        </BrowserRouter>
      </div>
    </Auth0Provider>
  );
};
