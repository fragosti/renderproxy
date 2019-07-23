import * as React from 'react';
import { Link } from 'react-router-dom';

import { RETURN_TO_URL } from '../constants';
import { useAuth0 } from '../util/Auth0';

export const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && <button onClick={() => loginWithRedirect({} as any)}>Log in</button>}

      {isAuthenticated && (
        <button
          onClick={() =>
            logout({
              returnTo: RETURN_TO_URL,
            })
          }
        >
          Log out
        </button>
      )}
      {isAuthenticated && (
        <span>
          <Link to='/'>Home</Link>&nbsp;
          <Link to='/profile'>Profile</Link>
        </span>
      )}
    </div>
  );
};
