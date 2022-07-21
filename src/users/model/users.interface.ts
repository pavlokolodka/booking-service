

export interface IUser {
_id: string,
email: string,
reg_token: string,
photo_avatar: string,
phone: string,
name: string, 
oneHour?: boolean,
oneDay?: boolean,
appointments: [{
  appointmentId: string
}]  
}

