import React, { useEffect } from "react";
import { Router, Redirect } from "react-router-dom";

const LinkRedirect = ({authService, handleLogin, match, history}) => {

  useEffect( () => {
    authService
    .linkLogin({linkid: match.params.linkid, secret: "test"})
    .then(result => handleLogin(result.data, true, "/appointments") )
    .catch( err => {console.log("nice try ;)"); history.push("/")})
  },
    []
  )
  
 return (
   <div>
     <br/>
     <br/>
     <br/>
     <h1>Redirecting...</h1>
   </div>
 ) 
}

export default LinkRedirect;
