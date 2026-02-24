import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private oauth2Client;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('google.clientId');
    const clientSecret = this.configService.get<string>('google.clientSecret');
    const redirectUri = this.configService.get<string>('google.callbackUrl');

    if (clientId && clientSecret) {
      this.oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri,
      );
    } else {
      this.logger.warn(
        'Google Client ID/Secret not configured. Google Calendar integration will be disabled.',
      );
    }
  }

  /*
   * Returns a list of busy intervals for the given time range.
   */
  async getBusyIntervals(
    refreshToken: string,
    timeMin: Date,
    timeMax: Date,
  ): Promise<{ start: Date; end: Date }[]> {
    if (!this.oauth2Client || !refreshToken) {
      return [];
    }

    try {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });

      const calendar = google.calendar({
        version: 'v3',
        auth: this.oauth2Client,
      });

      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          items: [{ id: 'primary' }],
        },
      });

      const busy = response.data.calendars?.['primary']?.busy || [];

      return busy.map((interval) => ({
        start: new Date(interval.start!),
        end: new Date(interval.end!),
      }));
    } catch (error: any) {
      const isInvalidGrant =
        error?.response?.data?.error === 'invalid_grant' ||
        error?.cause?.message === 'invalid_grant';
      if (isInvalidGrant) {
        this.logger.warn(
          'Google Calendar token expired or revoked. Reconnect the barber in admin. Skipping calendar for this request.',
        );
      } else {
        this.logger.error('Error fetching Google Calendar busy intervals', error);
      }
      return []; // Fail gracefully by returning empty busy list
    }
  }

  /**
   * Creates an event in Google Calendar
   */
  async createEvent(
    refreshToken: string,
    summary: string,
    description: string,
    startTime: Date,
    endTime: Date,
    attendeeEmail?: string,
  ): Promise<string | null> {
    if (!this.oauth2Client || !refreshToken) {
      this.logger.warn(
        'Cannot create Google Calendar event: OAuth client or refresh token missing',
      );
      return null;
    }

    try {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });

      const calendar = google.calendar({
        version: 'v3',
        auth: this.oauth2Client,
      });

      const event: calendar_v3.Schema$Event = {
        summary,
        description,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'America/New_York', // Ajusta según tu zona horaria
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'America/New_York',
        },
        attendees: attendeeEmail ? [{ email: attendeeEmail }] : [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 día antes
            { method: 'popup', minutes: 30 }, // 30 minutos antes
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        sendUpdates: 'all', // Envía notificaciones al cliente si tiene email
      });

      this.logger.log(`Google Calendar event created: ${response.data.id}`);
      return response.data.id || null;
    } catch (error: any) {
      const isInvalidGrant =
        error?.response?.data?.error === 'invalid_grant' ||
        error?.cause?.message === 'invalid_grant';
      if (isInvalidGrant) {
        this.logger.warn(
          'Google Calendar token expired or revoked. Event not created in calendar. Reconnect the barber in admin.',
        );
      } else {
        this.logger.error('Error creating Google Calendar event', error);
      }
      return null; // Fail gracefully
    }
  }
}
