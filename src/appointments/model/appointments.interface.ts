import { IDoctor } from '../../doctors/model/doctors.interface';
import { IUser } from '../../users/model/users.interface';


export interface IAppointment {
  _id: string,
  date: Date,
  user: IUser,
  doctor: IDoctor,
  active: boolean
}
