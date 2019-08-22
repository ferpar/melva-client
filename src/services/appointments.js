import axios from 'axios';

class AppointmentService {
  constructor() {
    let service = axios.create({
      baseURL: process.env.API_URL + "/appointments",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json"
      },
      withCredentials: true
    });
    this.service = service;
  }
  
  getSingle = (id) => {
    return this.service.get("/get-single/" + id)
      .then(result => result)
      .catch(err => console.error("error getting booking information for the selectethe selected date. Service level.", err))
  }

  get = (dateStr) => {
    return this.service.get("/get/" + dateStr)
      .then(result => result)
      .catch(err => console.error("Error retrieving appointments. Service level.", err))
  }

  getByUser = (userId) => {
    return this.service.get("/get-by-user/" + userId)
      .then(result => result)
      .catch(err => console.error("Error retrieving appointments for this user. Service level.", err))
  }

  book = (values) => {
   return this.service.post("/book", values) 
    .then(result => result)
    .catch(err => console.error("Error attempting to book, service level.", err))
  }

  getBooked = () => {
    return this.service.get("/booked")
      .then(result => result)
      .catch(err => console.error("Error retrieving pending appointments", err))
  }

  sendCampaign = (values) => {
   return this.service.post("/test-multimsg", values) 
    .then(result => result)
    .catch(err => console.error("Error attempting to book, service level.", err))
  }
}


export default AppointmentService;
