

export interface IDoctor {
_id: string,
email: string,
reg_token: string,
photo_avatar: string,
phone: string,
name: string, 
spec: string,
free?: boolean,
appointments_accepted: [{
  appointmentId: string
}]  
}
