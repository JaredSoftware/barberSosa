import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 0 })
  order: number; // Para ordenar las categorías
}

export const CategorySchema = SchemaFactory.createForClass(Category);
