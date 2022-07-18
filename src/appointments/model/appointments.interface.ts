import { IDoctor } from '../../doctors/model/doctors.interface';
import { IUser } from '../../users/model/users.interface';


export interface IAppointment {
  id: string,
  date: Date,
  user: IUser,
  doctor: IDoctor,
  active: boolean
}
