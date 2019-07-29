import axios from "axios";

class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: "http://192.168.1.51:3010/api/auth",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json"
      },
      withCredentials: true
    });
    this.service = service;
  }

  entrance = values => {
    //this is the joint signup/login for guests
    return this.service
      .post("/login-signup-guest", values)
      .then(result => {
        return result;
      })
      .catch(err =>
        console.error(
          "there was an error posting your info: service level",
          err
        )
      );
  };

  loggedin = () => {
    return this.service
      .get("/loggedin")
      .then(result => result)
      .catch(err => {
        if (err.response.status === 403) {
          console.log(err.response.data.message);
        } else {
          console.error("error checking if logged in: service level", err);
        }
      });
  };

  logout = () => {
    return this.service
      .get("/logout")
      .then(result => result)
      .catch(err =>
        console.error("error attempting to logout: service level", err)
      );
  };

  guestLogin = values => {
    return this.service
      .post("/login-guest", values)
      .then(result => result)
      .catch(err =>
        console.error(
          "there was an error logging in as a guest. Service level error.",
          err
        )
      );
  };

  guestSignup = values => {
    return this.service
      .post("/signup-guest", values)
      .then(result => result)
      .catch(err =>
        console.error("there was an error during sign-up. Service level.", err)
      );
  };

  userLogin = values => {
    return this.service
      .post("/login", values)
      .then(result => result)
      .catch(err => console.error("Error during login. Service level", err));
  };

  userEdit = values => {
    return this.service
      .post("/edit", values)
      .then(result => result)
      .catch(err =>
        console.error("Error during profile edit. Service level", err)
      );
  };
}

export default AuthService;
