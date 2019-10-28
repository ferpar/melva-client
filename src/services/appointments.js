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

  create = (appointments) => {
    return this.service.post("/create", appointments)
      .catch( err => console.error("[Service] Error creating appointments", err))
  }
  
  getSingle = (id) => {
    return this.service.get("/get-single/" + id)
      .catch(err => console.error("error getting booking information for the selectethe selected date. Service level.", err))
  }

  get = (dateStr) => {
    return this.service.get("/get/" + dateStr)
      .catch(err => console.error("Error retrieving appointments. Service level.", err))
  }

  getByUser = (userId) => {
    return this.service.get("/get-by-user/" + userId)
      .catch(err => console.error("Error retrieving appointments for this user. Service level.", err))
  }

  book = (values) => {
   return this.service.post("/book", values) 
    .catch(err => console.error("Error attempting to book, service level.", err))
  }

  getBooked = () => {
    return this.service.get("/booked")
      .catch(err => console.error("Error retrieving pending appointments", err))
  }

  sendCampaign = (values) => {
   return this.service.post("/test-multimsg", values) 
    .catch(err => console.error("Error sending campaign messages, service level.", err))
  }
}


export default AppointmentService;
