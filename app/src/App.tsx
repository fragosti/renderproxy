import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { PrivateRoute } from './components/PrivateRoute';
import { Auth0Provider } from './util/Auth0';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './constants';
import { Navbar } from './components/Navbar';
import { Profile } from "./components/Profile";
import './App.css';

const onRedirectCallback = (appState: any) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

export const App: React.FC = () => {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      client_id={AUTH0_CLIENT_ID}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <div className="App">
      <BrowserRouter>
        <header>
          <Navbar />
        </header>
        <Switch>
          <Route path="/" exact />
          <PrivateRoute path="/profile" Component={Profile} />
        </Switch>
      </BrowserRouter>
      </div>
    </Auth0Provider>
  );
}
