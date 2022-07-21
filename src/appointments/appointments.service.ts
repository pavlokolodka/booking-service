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
    ) {this.createInterval()}
   
  public async create(req: Request, res: Response) {
    try {
      const userId = req?.body?.userId;
      const doctorId = req?.body?.doctorId;
      const date = req?.body?.date;
  
      if (!(userId && doctorId && date)) {
        return res.status(400).json("userId or doctorId not passed");
      }
     
      const user = await this.userRepo.findOne({id: userId});
      const doctor = await this.doctorRepo.findOne({id: doctorId});
     
      if (doctor && user) {
        const appointment = await this.appointmentRepo.create({
          date: date,
          user: userId,
          doctor: doctorId, 
          active: true
        });

        if (!this.expirationCheck(appointment.date)) return res.json('appointment expired');

        const isFree = await this.doctorService.checkAppointments(doctorId, appointment, res); 
        if (isFree) {
          user.appointments.push({appointmentId: appointment._id});
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
      
      return res.status(404).json("userId or doctorId or date not exist");
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

 private async createInterval() {
    const oneDay = 86400000;
    const oneHour = 3600000;
    setInterval(async () => {
      const appointments = await this.appointmentRepo.find().populate('user').populate('doctor');
      appointments.forEach(async (appointment) => {
        if (!appointment.user.oneDay) {
          if (Number(appointment.date) <= Date.now() + oneDay) {
            const user = await this.userRepo.findOne({_id: appointment.user._id});
            user!.oneDay = true;
            const dataOneDay = `${Date.now()} | Привет ${appointment.user.name}! Напоминаем что вы записаны к ${appointment.doctor.spec} завтра в ${appointment.date}!`
            fs.writeFile(path.resolve(__dirname, 'notification.log'), dataOneDay, err => {
              if (err) {
                console.error(err);
              }
            });
            await user!.save();
          }
        }
        else if (!appointment.user.oneHour) {
          if (Number(appointment.date) <= Date.now() + oneHour) {
            const user = await this.userRepo.findOne({_id: appointment.user._id});
            user!.oneHour = true;
            const dataOneDay = `${Date.now()} | Привет ${appointment.user.name}! Вам через 2 часа к ${appointment.doctor.spec}  в ${appointment.date}!`
            fs.writeFile(path.resolve(__dirname, 'notification.log'), dataOneDay, err => {
              if (err) {
                console.error(err);
              }
            });
            await user!.save();
          }
        }
      })
    }, oneHour);
  }
}

