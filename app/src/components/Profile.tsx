import React, { useState } from 'react';
import { useAuth0 } from '../util/Auth0';

import { API_ENDPOINT } from '../constants';

export const Profile: React.StatelessComponent = () => {
  const { isLoading, user, getTokenSilently } = useAuth0();
  const [apiMessage, setApiMessage] = useState('');
  if (isLoading || !user) {
    return <>Loading...</>;
  }

  const callApi = async () => {
    try {
      const token = await getTokenSilently();

      const response = await fetch(`${API_ENDPOINT}/proxy_setting`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: 'google4.com',
          urlToProxy: 'https://codenail.com',
        }),
      });

      const responseData = await response.json();

      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <img src={user.picture} alt="Profile" />
      <button onClick={callApi}> Ping API</button>
      {JSON.stringify(apiMessage, null, 2)}
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
    </>
  );
};
