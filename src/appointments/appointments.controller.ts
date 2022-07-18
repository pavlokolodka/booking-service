import { Router, Request, Response } from "express";
import {AppointmentService} from "./appointments.service"


export class AppointmentController {
  public router = Router();
  
  constructor(private appointmentService = new AppointmentService()) {this.initializeRoutes()}

  private initializeRoutes() {
    this.router.post('/create', async (req: Request, res: Response) => {
      const appointment = await this.appointmentService.create(req, res);
      return appointment;
    });
  }
}