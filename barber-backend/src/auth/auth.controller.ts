import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import type { UserDocument } from '../users/schemas/user.schema';
import type { BarberoDocument } from '../barber/schemas/barbero.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const COOKIE_NAME = 'access_token';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function setAuthCookie(res: Response, token: string, req?: Request) {
  const proto = req?.headers?.['x-forwarded-proto'];
  const isSecure = process.env.NODE_ENV === 'production' || proto === 'https';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  });
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** Registrar nuevo usuario */
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.register(registerDto);
    setAuthCookie(res, data.access_token, req);
    return data;
  }

  /** Login con email/username y password */
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(loginDto);
    setAuthCookie(res, data.access_token, req);
    return data;
  }

  /** Redirige a Google OAuth: vincula cuenta de Google como barbero (solo calendario) */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  /** Callback de Google: crea/actualiza barbero en colección barberos y redirige al admin (sin login) */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: { user: BarberoDocument },
    @Res() res: Response,
  ) {
    const frontendUrl =
      process.env.FRONTEND_CALLBACK_URL ?? 'http://localhost:3000';
    const redirect = `${frontendUrl}/admin?google_connected=1`;
    res.redirect(redirect);
  }

  /** Diagnóstico: qué ve el backend (sin auth). Útil para depurar 401. */
  @Get('debug')
  debug(@Req() req: Request) {
    const hasCookie = !!(req.cookies && req.cookies[COOKIE_NAME]);
    const auth = req.headers?.authorization;
    const hasAuth = !!(
      auth &&
      typeof auth === 'string' &&
      auth.startsWith('Bearer ')
    );
    const forwarded = req.headers?.['x-forwarded-authorization'];
    const hasForwarded = !!(
      forwarded &&
      typeof forwarded === 'string' &&
      forwarded.startsWith('Bearer ')
    );
    return {
      hasCookie,
      hasAuthHeader: hasAuth,
      hasXForwardedAuth: hasForwarded,
      hint:
        !hasCookie && !hasAuth && !hasForwarded
          ? 'Ningún token llega al backend. Revisa nginx (Cookie, Authorization) o haz login de nuevo.'
          : 'El backend recibe algún token; si /me da 401, el token puede estar caducado o el usuario no existe en BD.',
    };
  }

  /** Cerrar sesión: borra la cookie de acceso */
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie(COOKIE_NAME, '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Sesión cerrada' };
  }

  /** Devuelve el usuario actual (requiere token en cookie o header) */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user: UserDocument }) {
    const { password, ...rest } = req.user.toObject();
    return rest;
  }
}
