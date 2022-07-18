import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import { AppointmentController } from './appointments/appointments.controller';



const app: express.Application = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI!;
const appointmentController = new AppointmentController();


app.use(express.json());
app.use('/booking', appointmentController.router);


(function start() {
  mongoose.connect(
    mongoURI,
    () => console.log('Connected to DB')
  );
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  }) 
})();