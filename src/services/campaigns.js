import axios from 'axios';

class CampaignService {
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

  load = () => {
    return this.service.get("/all")
      .then(result => result)
      .catch(err => console.error("Error retrieving all campaigns", err))
  }

  getByTitle = title => {
    return this.service.get("/get-by-title/" + title)
      .then(result => result)
    .catch(err => console.error("Error retrieving the campaign by title", err))
  }

  getById = id => {
    return this.service.get("/get-by-id/" + id)
      .then(result => result)
      .catch(err => console.error("Error retrieving campaign by id", err))
  }

  removeCampaignUser = values => {
    return this.service.post("/rem-camp-user", values)
      .then(result => result)
      .catch(err => console.error("Error removing campaignUser and all its references", err))
  }

  removeUser = values => {
    return this.service.post("remove-user", values)
      .then(result => result)
      .catch(err => console.error("Error removing user and respective references", err))
  }

  remove = values => {
    return this.service.post("/remove", values)
      .then(result => result)
      .catch(err => console.error("Error removing campaign and its campaignUsers", err))
  }

}


export default CampaignService;
