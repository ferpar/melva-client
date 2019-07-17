import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return loggedIn ? (
          <Comp {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
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
