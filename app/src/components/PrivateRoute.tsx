import React, { useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';

import { useAuth0 } from '../util/Auth0';

export interface PrivateRouteProps extends RouteProps {
  Component: React.FC;
  path: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ Component, path, ...rest }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  useEffect(() => {
    const fn = async () => {
      if (isAuthenticated === false) {
        const redirectOptions = {
          appState: { targetUrl: path },
        };
        await loginWithRedirect(redirectOptions as any);
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect, path]);

  const render = (props: any) => (isAuthenticated === true ? <Component {...props} /> : null);

  return <Route path={path} render={render} {...rest} />;
};
