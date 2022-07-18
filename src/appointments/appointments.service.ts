import {v4 as uuidv4} from 'uuid';
import { Request, Response } from "express";
import { Doctor } from '../doctors/model/doctors.model';
import { User } from '../users/model/users.model';
import { Appointment } from './model/appointments.model';
import { DoctorService } from '../doctors/doctors.service';
import fs from 'fs';
import path from 'path';




export class AppointmentService {

  constructor(
    private appointmentRepo = Appointment,
    private doctorRepo = Doctor,
    private userRepo = User,
    private doctorService = new DoctorService()
    ) {}
   
  public async create(req: Request, res: Response) {
    try {
      const userId = req?.body?.userId;
      const doctorId = req?.body?.doctorId;
  
      if (!(userId && doctorId)) {
        return res.status(400).json("userId or doctorId not passed");
      }
     
      const user = await this.userRepo.findOne({id: userId});
      const doctor = await this.doctorRepo.findOne({id: doctorId});
     
      if (doctor && user) {
        let uuid = uuidv4();
        const appointment = await this.appointmentRepo.create({
          id: uuid,
          user: userId,
          doctor: doctorId, 
          active: true
        });

        if (!this.expirationCheck(appointment.date)) return res.json('appointment expired');

        const isFree = await this.doctorService.checkAppointments(doctorId, appointment, res); 
        if (isFree) {
          user.appointments.push({appointmentId: appointment.id});
          await user.save();
          return res.status(201).json(`
            doctorAppointment: ${isFree},
            userAppointment: ${user.appointments}
          `);
        } else {
          await this.appointmentRepo.deleteOne({id: appointment.id});
          return res.status(404).json('maximum number of applications');
        }      
      }
      
      return res.status(404).json("userId or doctorId not exist");
    } catch (e) {
      console.log(e);
    }
  }

  private async expirationCheck(appointment: any) {
    const createdTime = appointment.date;

    if (Number(createdTime) < Date.now()) {
      appointment.active = false;
      await appointment.save();
      return false;
    }

    return true;
  }


  private async createNotification() {
    const oneDay = 86400000;
    const oneHour = 3600000;
    while (true) {
      const appointments = await this.appointmentRepo.find().populate('user, doctor');

      setTimeout(() => {
        appointments.forEach((appointment) => {
          if (Number(appointment.date) === Date.now() + oneDay) {
            const dataOneDay = `${Date.now()} | Привет ${appointment.user.name}! Напоминаем что вы записаны к ${appointment.doctor.spec} завтра в ${appointment.date}!`
            fs.writeFile(path.resolve(__dirname, 'notification.log'), dataOneDay, err => {
              if (err) {
                console.error(err);
              }
            });
          }
          else if (Number(appointment.date) === Date.now() + oneHour) {
            const dataOneDay = `${Date.now()} | Привет ${appointment.user.name}! Вам через 2 часа к ${appointment.doctor.spec}  в ${appointment.date}!`
            fs.writeFile(path.resolve(__dirname, 'notification.log'), dataOneDay, err => {
              if (err) {
                console.error(err);
              }
            });
          }
        })
      }, 300000);
      
    }
  }
}