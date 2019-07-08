import * as React from "react";
import { useAuth0 } from "../util/Auth0";

export const Profile: React.StatelessComponent = () => {
  const { isLoading, user } = useAuth0();

  if (isLoading || !user) {
    return <>Loading...</>;
  }

  return (
    <>
      <img src={user.picture} alt="Profile" />

      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
    </>
  );
};
