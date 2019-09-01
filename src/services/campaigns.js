import axios from 'axios';

class AppointmentService {
  constructor() {
    let service = axios.create({
      baseURL: process.env.API_URL + "/campaigns",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json"
      },
      withCredentials: true
    });
    this.service = service;
  }
  
  save = values => {
    return this.service.post("/post", values)
      .then(result => result)
      .catch(err => console.error("Error saving the campaign to the DB", err))
  }

  getByTitle = title => {
    return this.service.get("/get-by-title/" + title)
      .then(result => result)
    .catch(err => console.error("Error retrieving the campaign by title", err))
  }

  getById = id => {
    return this.service.get("/get-by-id/" + id)
      .then(result => result)
      .catch(err => console.error("Error retrieving campaign buy id", err))
  }

  removeCampaignUser = values => {
    return this.service.post("/rem-camp-user", values)
      .then(result => result)
      .catch(err => console.error("Error removing campaignUser and all its references", err))
  }

  remove = values => {
    return this.service.post("/remove", values)
      .then(result => result)
      .catch(err => console.error("Error removing campaign and its campaignUsers", err))
  }

}


export default AppointmentService;
