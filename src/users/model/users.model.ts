import { Schema, model } from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import { IUser } from './users.interface';

let uuid = uuidv4();

const userSchema = new Schema<IUser>({
  _id: {
    type: String,
    default: uuidv4
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
  oneDay: {
    type: Boolean,
    default: false
  },
  oneHour: {
    type: Boolean,
    default: false
  },
  appointments:[{
    appointmentId: {
      type: String,
      ref: 'APPOINTMENTS'
    }
  }]
});


export const User = model<IUser>('USER', userSchema);