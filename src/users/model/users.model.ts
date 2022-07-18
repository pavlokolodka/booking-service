import { Schema, model } from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import { IUser } from './users.interface';

let uuid = uuidv4();

const userSchema = new Schema<IUser>({
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
  appointments:[{
    appointmentId: {
      type: String,
      required: true,
      ref: 'APPOINTMENTS'
    }
  }]
});


export const User = model<IUser>('USER', userSchema);