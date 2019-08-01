import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Comp, loggedIn, path, redirectURL="/", allowedRoles=['Customer', 'Admin'], user,  ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return (loggedIn && allowedRoles.includes(user.role)) ? (
          <Comp {...props} />
        ) : (
          <Redirect
            to={{
              pathname: redirectURL,
              navstate: {
                prevLocation: path,
                error: "You need to log in first!"
              }
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
