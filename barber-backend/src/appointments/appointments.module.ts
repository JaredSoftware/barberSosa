import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { Barbero, BarberoSchema } from '../barber/schemas/barbero.schema';

import { GoogleCalendarService } from './google-calendar.service';

import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Barbero.name, schema: BarberoSchema },
    ]),
    ConfigurationModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, GoogleCalendarService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
