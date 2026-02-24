import { Body, Post, Req, BadRequestException } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import type { RequestWithSession } from '../cart/session.middleware';
import { MercadoPagoService } from './mercadopago.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly mercadopagoService: MercadoPagoService) {}

  /**
   * Crea una preferencia de Mercado Pago (Checkout Pro) con el carrito actual.
   * Responde con init_point: URL para redirigir al usuario a pagar.
   */
  @Post('create-preference')
  async createPreference(
    @Body() dto: CreatePreferenceDto,
    @Req() req: RequestWithSession,
  ) {
    const identifier = req.userId || req.sessionId;
    if (!identifier) {
      throw new BadRequestException('Se requiere sesión o usuario autenticado');
    }
    return this.mercadopagoService.createPreference(
      identifier,
      dto.payerEmail || dto.payerName || dto.payerSurname
        ? {
            email: dto.payerEmail,
            name: dto.payerName,
            surname: dto.payerSurname,
          }
        : undefined,
      dto.externalReference,
    );
  }
}
