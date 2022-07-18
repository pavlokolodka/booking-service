import { Schema, model } from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import { IDoctor } from './doctors.interface';


let uuid = uuidv4();

const doctorSchema = new Schema<IDoctor>({
  id: {
    type: String,
    default: uuid
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  reg_token: String,
  photo_avatar: String,
  phone: String,
  name: String, 
  spec: String,
  free: {
    type: Boolean,
    default: false
  },
  appointments_accepted: [{
    appointmentId: {
      type: String,
      required: true,
      ref: 'APPOINTMENTS'
    }
  }]
});


export const Doctor = model<IDoctor>('DOCTOR', doctorSchema);