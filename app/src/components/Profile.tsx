import React, { useState } from 'react';
import { useAuth0 } from '../util/Auth0';

import { API_ENDPOINT } from '../constants';

export const Profile: React.StatelessComponent = () => {
  const { isLoading, user, getTokenSilently } = useAuth0();
  if (isLoading || !user) {
    return <>Loading...</>;
  }

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      await fetch(`${API_ENDPOINT}/proxy_setting`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: 'sample-s3-spa.com',
          urlToProxy: 'https://medium.com/the-mission',
          userId: user.sub,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <img src={user.picture} alt='Profile' />
      <button onClick={callApi}> Ping API</button>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
    </>
  );
};
