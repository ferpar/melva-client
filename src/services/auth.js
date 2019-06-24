import axios from 'axios';

class AuthService {
  constructor() {
    let service = axios.create({
      baseURL:"http://192.168.1.51:3010/api/auth",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json"
      },
      withCredentials: true
    });
    this.service = service;
  }

  entrance = (values) => {
    return this.service.post("/login-signup-guest", values)
      .then(result => {
        console.log(result)
        return result})
      .catch(err => console.error("there was an error posting your info: service level", err))
  } 

  loggedin = () => {
    return this.service.get("/loggedin")
      .then(result => result)
      .catch(err => console.error("error checking ig logged in: service level", err))
  }

  logout = () => {
    return this.service.get("logout")
      .then(result => result)
      .catch(err => console.error("error attempting to logout: service level", err))
  }

}


export default AuthService;
