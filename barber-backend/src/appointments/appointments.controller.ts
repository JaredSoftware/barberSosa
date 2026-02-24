import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    console.log(
      'Controller received DTO:',
      JSON.stringify(createAppointmentDto),
    );
    try {
      return await this.appointmentsService.create(createAppointmentDto);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  @Get('availability')
  async getAvailability(
    @Query('date') date: string,
    @Query('barberId') barberId?: string,
  ) {
    if (!date) {
      throw new BadRequestException('date is required');
    }
    return this.appointmentsService.getAvailableSlots(date, barberId);
  }

  @Get()
  async findAll(@Query('start') start?: string, @Query('end') end?: string) {
    return this.appointmentsService.findAll(start, end);
  }

  @Get('stats/revenue')
  async getRevenueStats() {
    return this.appointmentsService.getDashboardStats();
  }
}
