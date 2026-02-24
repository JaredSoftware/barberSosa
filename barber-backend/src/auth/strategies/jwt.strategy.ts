import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { AuthService } from '../auth.service';

export type JwtPayload = { sub: string; email: string };

/** Extrae el JWT de cookie, Authorization o X-Forwarded-Authorization (la cookie la envía el navegador siempre en same-origin) */
function jwtFromRequest(req: Request): string | null {
  const cookie = req.signedCookies?.access_token ?? req.cookies?.access_token;
  if (cookie && typeof cookie === 'string') return cookie;
  const auth = req.headers?.authorization;
  if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7);
  const forwarded = req.headers?.['x-forwarded-authorization'];
  if (forwarded && typeof forwarded === 'string' && forwarded.startsWith('Bearer ')) return forwarded.slice(7);
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => jwtFromRequest(req),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.secret') ?? 'default-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
