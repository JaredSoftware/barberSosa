import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Barbero, BarberoSchema } from './schemas/barbero.schema';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Barbero.name, schema: BarberoSchema }]),
  ],
  controllers: [BarberController],
  providers: [BarberService],
  exports: [BarberService],
})
export class BarberModule {}
