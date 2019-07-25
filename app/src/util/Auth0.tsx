/* tslint:disable */
import * as Auth0SpaJs from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import React, { StatelessComponent, useContext, useEffect, useState } from 'react';

import { noop, noopAsync, noopAsyncThrow } from '../util/util';

const createAuth0Client = Auth0SpaJs.default;

const DEFAULT_REDIRECT_CALLBACK = () => window.history.replaceState({}, document.title, window.location.pathname);

export interface Auth0ProviderProps extends Auth0ClientOptions {
  onRedirectCallback: (appState: any) => void;
}

export interface User {
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  email: string;
  sub: string;
}

export interface Auth0Context
  extends Pick<
    Auth0Client,
    'getIdTokenClaims' | 'loginWithRedirect' | 'getTokenSilently' | 'getTokenWithPopup' | 'logout'
  > {
  isAuthenticated: boolean | null;
  user: User | null;
  isLoading: boolean;
  isPopupOpen: boolean;
  loginWithPopup: () => Promise<void>;
  handleRedirectCallback: () => Promise<void>;
}

const defaultContext: Auth0Context = {
  isAuthenticated: null,
  user: null,
  isLoading: true,
  isPopupOpen: false,
  loginWithPopup: noopAsync,
  handleRedirectCallback: noopAsync,
  getIdTokenClaims: noopAsyncThrow,
  loginWithRedirect: noopAsync,
  getTokenSilently: noopAsyncThrow,
  getTokenWithPopup: noopAsyncThrow,
  logout: noop,
};

export const Auth0Context = React.createContext(defaultContext);

export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider: StatelessComponent<Auth0ProviderProps> = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState() as [Auth0Client, React.Dispatch<any>];
  const [isLoading, setLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }
      // Typings are incorrect
      const isAuthenticated: boolean = await (auth0FromHook as any).isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  const value: Auth0Context = {
    isAuthenticated,
    user,
    isLoading,
    isPopupOpen,
    loginWithPopup,
    handleRedirectCallback,
    getIdTokenClaims: (...args) => auth0Client.getIdTokenClaims(...args),
    loginWithRedirect: (...args) => auth0Client.loginWithRedirect(...args),
    getTokenSilently: (...args) => auth0Client.getTokenSilently(...args),
    getTokenWithPopup: (...args) => auth0Client.getTokenWithPopup(...args),
    logout: (...args) => auth0Client.logout(...args),
  };
  return <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>;
};
