import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopConfigDocument = ShopConfig & Document;

@Schema({ timestamps: true, collection: 'shop_config' })
export class ShopConfig {
  @Prop({ required: true, default: [0, 1, 2, 3, 4, 5, 6] }) // 0=Sun, 1=Mon...
  workingDays: number[];

  @Prop({ required: true, default: '09:00' })
  openTime: string;

  @Prop({ required: true, default: '20:00' })
  closeTime: string;

  @Prop({ type: [Date], default: [] })
  holidays: Date[];

  @Prop({ required: true, default: 60 }) // Minutes
  slotDuration: number;
}

export const ShopConfigSchema = SchemaFactory.createForClass(ShopConfig);
