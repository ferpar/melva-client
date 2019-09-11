import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Comp, loggedIn, path, redirectURL="/", allowedRoles=['Customer', 'Admin'], accessLevel=null, user,  ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return (loggedIn && allowedRoles.includes(user.role) && (!accessLevel || accessLevel.includes(user.accessLevel)) ) ? (
          <Comp {...props} />
        ) : (
          <Redirect
            to={{
              pathname: redirectURL,
              navstate: {
                prevLocation: path,
                error: "PLease, check your credentials"
              }
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
