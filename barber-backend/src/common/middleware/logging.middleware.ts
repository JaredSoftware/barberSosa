import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, body } = req;

    // Only log body for POST/PUT requests to api/appointments
    if (
      originalUrl.includes('/api/appointments') &&
      (method === 'POST' || method === 'PUT')
    ) {
      this.logger.log(
        `Incoming Request: ${method} ${originalUrl} - Body: ${JSON.stringify(body)}`,
      );
    }

    next();
  }
}
