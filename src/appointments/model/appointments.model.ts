import { Schema, model } from 'mongoose';
import { IAppointment } from './appointments.interface'
import {v4 as uuidv4} from 'uuid';

let uuid = uuidv4();

const appointmentsSchema = new Schema<IAppointment>({
  _id: {
    type: String,
    default: uuidv4
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    ref: 'USER'
  },
  doctor: {
    type: String,
    ref: 'DOCTOR'
  },
  active: {
    type: Boolean,
    default: true
  }
});


export const Appointment = model<IAppointment>('APPOINTMENTS', appointmentsSchema);