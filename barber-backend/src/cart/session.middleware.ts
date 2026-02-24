import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface RequestWithSession extends Request {
  sessionId?: string;
  userId?: string;
}

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: RequestWithSession, res: Response, next: NextFunction) {
    // 1. Intentar obtener userId del JWT (si está autenticado)
    if (req.user && (req.user as any).userId) {
      req.userId = (req.user as any).userId;
    }
    
    // 2. Obtener o crear sessionId de la cookie
    const COOKIE_NAME = 'cart_session_id';
    let sessionId = req.cookies?.[COOKIE_NAME];
    
    if (!sessionId) {
      // Generar nuevo sessionId
      sessionId = uuidv4();
      
      // Establecer cookie con 30 días de expiración
      res.cookie(COOKIE_NAME, sessionId, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
        sameSite: 'lax',
        secure: process.env.COOKIE_SECURE === 'true', // true solo con HTTPS
      });
    }
    
    req.sessionId = sessionId;
    
    next();
  }
}
