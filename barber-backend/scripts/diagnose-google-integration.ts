import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { BarberService } from '../src/barber/barber.service';
import { GoogleCalendarService } from '../src/appointments/google-calendar.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const barberService = app.get(BarberService);
  const googleCalendarService = app.get(GoogleCalendarService);
  const logger = new Logger('DiagnoseGoogleIntegration');

  console.log('--- Starting Diagnosis ---');

  const barbers = await barberService.findAll();
  console.log(`Found ${barbers.length} barbers.`);

  for (const barber of barbers) {
    console.log(`\nBarber: ${barber.name} (${barber.email})`);
    console.log(`  Google ID: ${barber.googleId}`);
    console.log(`  Has Refresh Token: ${!!barber.googleRefreshToken}`);

    if (barber.googleRefreshToken) {
      console.log('  Testing Google Calendar integration...');
      try {
        const now = new Date();
        const end = new Date(now.getTime() + 1000 * 60 * 60 * 24); // 24 hours from now

        const busyIntervals = await googleCalendarService.getBusyIntervals(
          barber.googleRefreshToken,
          now,
          end,
        );
        console.log(
          `  [SUCCESS] Retrieved ${busyIntervals.length} busy intervals.`,
        );
      } catch (error) {
        console.error('  [FAILURE] Error testing calendar:', error.message);
      }
    } else {
      console.log('  [SKIPPING] No refresh token available.');
    }
  }

  console.log('\n--- Diagnosis Complete ---');
  await app.close();
}

bootstrap();
