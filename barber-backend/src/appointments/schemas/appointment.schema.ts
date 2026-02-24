import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Barbero } from '../../barber/schemas/barbero.schema';
import { User } from '../../users/schemas/user.schema';

export type AppointmentDocument = Appointment & Document;

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'Barbero', required: true })
  barber: Barbero | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: User | Types.ObjectId;

  @Prop()
  clientName?: string;

  @Prop()
  clientEmail?: string;

  @Prop()
  clientPhone?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 60 }) // Duration in minutes
  duration: number;

  @Prop({ default: 0 })
  price: number;

  @Prop({
    type: String,
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Prop()
  notes?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// Compound index to quickly check for overlapping appointments for a barber
AppointmentSchema.index({ barber: 1, date: 1 });
