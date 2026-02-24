import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema({ timestamps: true })
export class Offer {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: number; // Duración en minutos

  @Prop()
  icon?: string; // Nombre del icono o URL

  @Prop({ default: true })
  active: boolean;

  @Prop()
  image?: string; // URL de imagen

  @Prop({ type: [String], default: [] })
  features: string[]; // Características incluidas

  @Prop({ default: false })
  premium: boolean; // Si es true, se muestra en la sección "Reservas Premium" (grid); si no, en servicios generales (cards)
}

export const OfferSchema = SchemaFactory.createForClass(Offer);

// Asegurar que premium siempre sea booleano en las respuestas JSON
OfferSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.premium = ret.premium === true;
    return ret;
  },
});

OfferSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.premium = ret.premium === true;
    return ret;
  },
});
