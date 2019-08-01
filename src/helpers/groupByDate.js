export default function groupByDate(appointments){
  const orderedAppointments = {};
  appointments.forEach( appointment => {
    let date = new Date(appointment.time).toLocaleDateString();
    if (orderedAppointments.hasOwnProperty(date)) {
      orderedAppointments[date].push(appointment);
    } else {
      orderedAppointments[date]=[appointment];
    }
  })
  return orderedAppointments
};
