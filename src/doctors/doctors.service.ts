import {v4 as uuidv4} from 'uuid';
import { Response } from "express";
import { Doctor } from '../doctors/model/doctors.model';
import { IAppointment } from '../appointments/model/appointments.interface';


export class DoctorService {

  constructor(
    private doctorRepo = Doctor,
    
    ) {}

  public async checkAppointments(doctorId: typeof uuidv4, appointment: IAppointment, res: Response) {
    try {
      if (!doctorId) {
        return res.status(400).send("doctorId not passed");
      }
   
      const doctor = await this.doctorRepo.findOne({_id: doctorId});
     
      if (doctor) {
        const numberOfappointments = doctor.appointments_accepted.length;
  
        if (!(numberOfappointments < 3)) return false;
        
        doctor.appointments_accepted.push({appointmentId: appointment._id});
        await doctor.save();
       
        return doctor.appointments_accepted;
      }
      
      return res.status(404).send("doctorId not exist");
    } catch (e) {
      console.log(e);
    }
  }
}