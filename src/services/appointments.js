import axios from 'axios';

class AppointmentService {
  constructor() {
    let service = axios.create({
      baseURL:"http://192.168.1.51:3010/api/appointments",
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

  
  book = (values) => {
   return this.service.post("/book", values) 
    .then(result => result)
    .catch(err => console.error("Error attempting to book, service level.", err))
  }

  get = (dateStr) => {
    return this.service.get("/get/" + dateStr)
      .then(result => result)
      .catch(err => console.error("Error retrieving appointments. Service level", err))
  }

}


export default AppointmentService;
