import { Schema, model } from 'mongoose';
import { IAppointment } from './appointments.interface'
import {v4 as uuidv4} from 'uuid';

let uuid = uuidv4();

const appointmentsSchema = new Schema<IAppointment>({
  id: {
    type: String,
    default: uuid
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true,
    ref: 'USER'
  },
  doctor: {
    type: String,
    required: true,
    ref: 'DOCTOR'
  },
  active: {
    type: Boolean,
    default: true
  }
});


export const Appointment = model<IAppointment>('APPOINTMENTS', appointmentsSchema);