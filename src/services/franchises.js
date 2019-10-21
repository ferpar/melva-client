import axios from 'axios';

class FranchiseService {
  constructor() {
    let service = axios.create({
      baseURL: process.env.API_URL + "/franchises",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json"
      },
      withCredentials: true
    });
    this.service = service;
  }

  saveFranchise = values => {
    return this.service.post("/franchise-save", values)
          .catch( err => console.error("[FE-Service] Error saving franchise"))
  }
}

export default FranchiseService;
