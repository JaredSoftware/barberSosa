import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BarberoDocument = Barbero & Document;

/**
 * Barbero: cuenta de Google vinculada para calendario + datos para mostrar en reservas.
 */
@Schema({ timestamps: true, collection: 'barberos' })
export class Barbero {
  @Prop({ required: true, unique: true })
  googleId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  name?: string;

  @Prop()
  picture?: string;

  @Prop()
  googleRefreshToken?: string;

  /** Nombre artístico (lo que se muestra en reservas) */
  @Prop()
  nombreArtista?: string;

  /** Rol / título (ej. "Fundador & Master") */
  @Prop()
  rol?: string;

  /** URL de imagen para la ficha en reservas (si no se usa picture de Google) */
  @Prop()
  imagen?: string;

  /** Descripción corta del barbero */
  @Prop()
  descripcion?: string;

  /** Si se muestra en la página de reservas */
  @Prop({ default: true })
  activo: boolean;
}

export const BarberoSchema = SchemaFactory.createForClass(Barbero);
