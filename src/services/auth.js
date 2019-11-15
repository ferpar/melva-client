import axios from "axios";

class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: process.env.API_URL + "/auth",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json"
      },
      withCredentials: true
    });
    this.service = service;
  }

  loggedin = () => {
    return this.service
      .get("/loggedin")
      .catch(err => {
        if (err.response.status === 403) {
          console.log(err.response.data.message);
        } else {
          console.error("[Service] error checking if logged in", err);
        }
      });
  };

  logout = () => {
    return this.service
      .get("/logout")
      .catch(err =>
        console.error("[Service] error attempting to logout", err)
      );
  };

  signup = values => {
    return this.service
      .post("/signup", values)
      .catch( err => 
        console.error("[Service] Error signing user up", err)
      )
  };

  userLogin = values => {
    return this.service
      .post("/login", values)
      .catch(err => {
        console.error("[Service] Error during login.", err)
        return err
      });
  };

  userEdit = values => {
    return this.service
      .post("/edit", values)
      .catch(err =>
        console.error("[Service] Error during profile edit.", err)
      );
  };

  linkLogin = values => {
    return this.service
      .post("/link-login", values)
      .catch(err =>
        console.error("[Service] Error during link-login.", err)
      );
  };

  consent = values => {
    return this.service
      .post("/consent", values)
      .catch( err =>
          console.error("[Service] Error sending consent value", err)
      );
  };

  removeUser = values => {
    return this.service
      .post("/remove", values)
      .catch( err => 
        console.error("[Service] Error removing user", err)
      );
  };
}


export default AuthService;
