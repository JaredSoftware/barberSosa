import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Appointment,
  AppointmentDocument,
  AppointmentStatus,
} from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Barbero, BarberoDocument } from '../barber/schemas/barbero.schema';
import { GoogleCalendarService } from './google-calendar.service';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Barbero.name) private barberModel: Model<BarberoDocument>,
    private googleCalendarService: GoogleCalendarService,
    private configurationService: ConfigurationService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    let { barberId, date, userId } = createAppointmentDto;
    const appointmentDate = new Date(date);

    // If no barberId provided, find an available one
    if (!barberId) {
      const activeBarbers = await this.barberModel.find({ activo: true });
      for (const barber of activeBarbers) {
        if (
          await this.checkAvailability(barber._id.toString(), appointmentDate)
        ) {
          barberId = barber._id.toString();
          break;
        }
      }
      if (!barberId) {
        throw new BadRequestException('No barbers available at this time');
      }
    }

    // Validate barber exists
    const barber = await this.barberModel.findById(barberId);
    if (!barber) {
      throw new NotFoundException('Barber not found');
    }

    // Check availability (including Google Calendar and Shop Config)
    const isAvailable = await this.checkAvailability(barberId, appointmentDate);
    if (!isAvailable) {
      this.logger.warn(
        `Slot not available for barber ${barberId} at ${appointmentDate}`,
      );
      throw new BadRequestException('Slot is not available');
    }

    const newAppointment = new this.appointmentModel({
      ...createAppointmentDto,
      barber: new Types.ObjectId(barberId),
      user: userId ? new Types.ObjectId(userId) : undefined,
      date: appointmentDate,
    });

    const savedAppointment = await newAppointment.save();

    // Create event in Google Calendar if barber has refresh token
    if (barber.googleRefreshToken) {
      this.logger.log(
        `Attempting to create Google Calendar event for barber ${barber.email}`,
      );
      const endTime = new Date(appointmentDate);
      endTime.setMinutes(endTime.getMinutes() + 60); // 1 hour duration

      const summary = `Cita - ${createAppointmentDto.clientName || 'Cliente'}`;
      const description = `
Cliente: ${createAppointmentDto.clientName || 'N/A'}
Email: ${createAppointmentDto.clientEmail || 'N/A'}
Teléfono: ${createAppointmentDto.clientPhone || 'N/A'}
Notas: ${createAppointmentDto.notes || 'N/A'}
      `.trim();

      await this.googleCalendarService.createEvent(
        barber.googleRefreshToken,
        summary,
        description,
        appointmentDate,
        endTime,
        createAppointmentDto.clientEmail,
      );
    }

    return savedAppointment;
  }

  async checkAvailability(barberId: string, date: Date): Promise<boolean> {
    const start = new Date(date);
    const end = new Date(date);
    end.setMinutes(end.getMinutes() + 60); // Assuming 1 hour duration

    // 0. Check Shop Configuration (Working Days/Hours/Holidays)
    const isWorkingDay = await this.configurationService.isWorkingDay(start);
    if (!isWorkingDay) return false;

    const workingHours = await this.configurationService.getWorkingHours(start);
    const [openHour, openMinute] = workingHours.start.split(':').map(Number);
    const [closeHour, closeMinute] = workingHours.end.split(':').map(Number);

    const openTime = new Date(start);
    openTime.setHours(openHour, openMinute, 0, 0);

    const closeTime = new Date(start);
    closeTime.setHours(closeHour, closeMinute, 0, 0);

    if (start < openTime || end > closeTime) return false;

    // 1. Check local DB
    const count = await this.appointmentModel.countDocuments({
      barber: new Types.ObjectId(barberId),
      status: AppointmentStatus.SCHEDULED,
      date: {
        $gte: start,
        $lt: end,
      },
    });

    if (count > 0) return false;

    // 2. Check Google Calendar if connected
    const barber = await this.barberModel.findById(barberId);
    if (barber && barber.googleRefreshToken) {
      const busyIntervals = await this.googleCalendarService.getBusyIntervals(
        barber.googleRefreshToken,
        start,
        end,
      );
      if (busyIntervals.length > 0) return false;
    }

    return true;
  }

  async getAvailableSlots(
    dateStr: string,
    barberId?: string,
  ): Promise<string[]> {
    // Parse YYYY-MM-DD explicitly to avoid UTC shift
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Local 00:00

    // Check if it is a working day
    const isWorkingDay = await this.configurationService.isWorkingDay(date);
    if (!isWorkingDay) return [];

    const shopConfig = await this.configurationService.getShopConfig();
    const [openHour, openMinute] = shopConfig.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = shopConfig.closeTime
      .split(':')
      .map(Number);

    date.setHours(openHour, openMinute, 0, 0); // Set start time

    const endOfDay = new Date(year, month - 1, day);
    endOfDay.setHours(closeHour, closeMinute, 0, 0); // Set end time

    let barbersToCheck: BarberoDocument[] = [];

    if (barberId) {
      const barber = await this.barberModel.findById(barberId);
      if (barber) barbersToCheck.push(barber);
    } else {
      barbersToCheck = await this.barberModel.find({ activo: true });
    }

    if (barbersToCheck.length === 0) return [];

    const slots: string[] = [];

    // Pre-fetch Google Calendar busy intervals for all relevant barbers
    const googleBusyMap = new Map<string, { start: Date; end: Date }[]>();
    await Promise.all(
      barbersToCheck.map(async (barber) => {
        if (barber.googleRefreshToken) {
          const busy = await this.googleCalendarService.getBusyIntervals(
            barber.googleRefreshToken,
            date,
            endOfDay,
          );
          googleBusyMap.set(barber._id.toString(), busy);
        }
      }),
    );

    // Iterate over slots
    while (date < endOfDay) {
      const slotStart = new Date(date);
      const slotEnd = new Date(date);
      slotEnd.setMinutes(slotEnd.getMinutes() + shopConfig.slotDuration);

      // Ensure slot doesn't exceed closing time
      if (slotEnd > endOfDay) break;

      let isSlotAvailable = false;

      // Check if AT LEAST ONE barber is available
      for (const barber of barbersToCheck) {
        const bId = barber._id.toString();

        // Check local DB
        const localCount = await this.appointmentModel.countDocuments({
          barber: new Types.ObjectId(bId),
          status: AppointmentStatus.SCHEDULED,
          date: {
            $gte: slotStart,
            $lt: slotEnd,
          },
        });

        if (localCount > 0) continue; // This barber is busy locally

        // Check Google Calendar
        const busyIntervals = googleBusyMap.get(bId) || [];
        const isGoogleBusy = busyIntervals.some((interval) => {
          return (
            (slotStart >= interval.start && slotStart < interval.end) ||
            (slotEnd > interval.start && slotEnd <= interval.end) ||
            (slotStart <= interval.start && slotEnd >= interval.end)
          );
        });

        if (isGoogleBusy) continue; // This barber is busy on Google

        // If we get here, this barber is free!
        isSlotAvailable = true;
        break; // We only need one available barber to show the slot
      }

      if (isSlotAvailable) {
        // Return local ISO string (stripped of timezone info) so frontend treats it as "Shop Time"
        // equivalent to: YYYY-MM-DDTHH:mm:ss
        const tzNeutral = new Date(
          slotStart.getTime() - slotStart.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, -1); // Remove 'Z'
        slots.push(tzNeutral);
      }
      date.setMinutes(date.getMinutes() + shopConfig.slotDuration);
    }

    return slots;
  }

  async findAll(startStr?: string, endStr?: string): Promise<Appointment[]> {
    const filter: any = {};

    if (startStr && endStr) {
      filter.date = {
        $gte: new Date(startStr),
        $lte: new Date(endStr),
      };
    } else if (startStr) {
      const start = new Date(startStr);
      const end = new Date(startStr);
      end.setHours(23, 59, 59, 999);
      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    return this.appointmentModel
      .find(filter)
      .populate('barber', 'name email picture color')
      .populate('user', 'name email phone')
      .sort({ date: 1 })
      .exec();
  }
  async getRevenueStats(year: number, month?: number, day?: number) {
    const start = new Date(year, (month || 1) - 1, day || 1);
    const end = new Date(year, (month || 1) - 1, day || 1);

    if (day) {
      end.setHours(23, 59, 59, 999);
    } else if (month) {
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // Last day of previous month ?? No, Month is 0-indexed in Date constructor but 1-based in arguments
      // better logic below
    } else {
      end.setFullYear(end.getFullYear() + 1);
      end.setDate(0);
    }

    // Correct date range logic
    const startDate = new Date(year, month ? month - 1 : 0, day ? day : 1);
    let endDate: Date;

    if (day) {
      endDate = new Date(year, (month || 1) - 1, day);
      endDate.setHours(23, 59, 59, 999);
    } else if (month) {
      endDate = new Date(year, month, 0); // Last day of the specified month
      endDate.setHours(23, 59, 59, 999);
    } else {
      endDate = new Date(year, 11, 31);
      endDate.setHours(23, 59, 59, 999);
    }

    // Aggregation: include SCHEDULED and COMPLETED (exclude CANCELLED)
    const pipeline = [
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: {
            $in: [
              AppointmentStatus.SCHEDULED,
              AppointmentStatus.COMPLETED,
            ],
          },
        },
      },
      {
        $group: {
          _id: '$barber',
          totalRevenue: { $sum: '$price' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'barberos',
          localField: '_id',
          foreignField: '_id',
          as: 'barberInfo',
        },
      },
      {
        $unwind: '$barberInfo',
      },
      {
        $project: {
          barberId: '$_id',
          name: '$barberInfo.name',
          email: '$barberInfo.email',
          revenue: '$totalRevenue',
          count: '$count',
        },
      },
    ];

    const barberStats = await this.appointmentModel.aggregate(pipeline);

    const totalRevenue = barberStats.reduce(
      (acc, curr) => acc + curr.revenue,
      0,
    );

    return {
      period: {
        start: startDate,
        end: endDate,
      },
      totalRevenue,
      barberStats,
    };
  }

  // Helper to get today/month/year stats in one go
  async getDashboardStats() {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

    const [today, month, year] = await Promise.all([
      this.getStatsForRange(todayStart, todayEnd),
      this.getStatsForRange(monthStart, monthEnd),
      this.getStatsForRange(yearStart, yearEnd),
    ]);

    // Group barber stats specifically for the "Producción por Barbero" table (usually daily or monthly? Report says Dia/Mes/Año)
    // We need a list of barbers and their stats for each period.

    const allBarbers = await this.barberModel.find({ activo: true });

    const barberData = allBarbers.map((barber) => {
      const bId = barber._id.toString();
      const dayStat = today.barberStats.find(
        (s) => s.barberId.toString() === bId,
      );
      const monthStat = month.barberStats.find(
        (s) => s.barberId.toString() === bId,
      );
      const yearStat = year.barberStats.find(
        (s) => s.barberId.toString() === bId,
      );

      return {
        barberId: bId,
        name: barber.name || barber.email, // fallback
        picture: barber.picture,
        color: '#493f22', // Mock or add to schema if needed
        initials: (barber.name || barber.email).substring(0, 2).toUpperCase(),
        dayRevenue: dayStat ? dayStat.revenue : 0,
        monthRevenue: monthStat ? monthStat.revenue : 0,
        yearRevenue: yearStat ? yearStat.revenue : 0,
      };
    });

    return {
      totalDay: today.totalRevenue,
      totalMonth: month.totalRevenue,
      totalYear: year.totalRevenue,
      barbers: barberData,
    };
  }

  private async getStatsForRange(start: Date, end: Date) {
    const pipeline = [
      {
        $match: {
          date: { $gte: start, $lte: end },
          status: {
            $in: [
              AppointmentStatus.SCHEDULED,
              AppointmentStatus.COMPLETED,
            ],
          },
        },
      },
      {
        $group: {
          _id: '$barber',
          totalRevenue: { $sum: '$price' },
          count: { $sum: 1 },
        },
      },
    ];
    const stats = await this.appointmentModel.aggregate(pipeline);
    const totalRevenue = stats.reduce(
      (acc, curr) => acc + curr.totalRevenue,
      0,
    );
    return {
      totalRevenue,
      barberStats: stats.map((s) => ({
        barberId: s._id,
        revenue: s.totalRevenue,
      })),
    };
  }
}
