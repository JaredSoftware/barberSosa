import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { BarberService } from '../../barber/barber.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private config: ConfigService,
    private barberService: BarberService,
  ) {
    const clientID = config.get<string>('google.clientId') ?? '';
    const clientSecret = config.get<string>('google.clientSecret') ?? '';

    // Si no hay clientID, usar valores dummy para evitar error
    // La estrategia no se usará si no hay clientID real
    super({
      clientID: clientID || 'dummy-client-id',
      clientSecret: clientSecret || 'dummy-client-secret',
      callbackURL:
        config.get<string>('google.callbackUrl') ??
        'http://localhost:4000/api/auth/google/callback',
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar'],
      accessType: 'offline',
      prompt: 'consent',
      passReqToCallback: false,
      authorizationParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    } as any);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id: string;
      emails?: { value: string }[];
      displayName?: string;
      photos?: { value: string }[];
    },
    done: VerifyCallback,
  ): Promise<void> {
    console.log('Google Auth Validate', {
      hasRefreshToken: !!refreshToken,
      refreshToken: refreshToken ? 'PRESENT' : 'MISSING',
      profileId: profile.id,
      displayName: profile.displayName,
      emails: profile.emails,
    });
    const email = profile.emails?.[0]?.value ?? '';
    const barbero = await this.barberService.findOrCreateFromGoogle({
      id: profile.id,
      email,
      displayName: profile.displayName,
      picture: profile.photos?.[0]?.value,
      refreshToken: refreshToken || undefined,
    });
    done(null, barbero);
  }
}
