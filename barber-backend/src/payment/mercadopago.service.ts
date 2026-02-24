import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import type { ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class MercadoPagoService {
  private readonly preference: Preference | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) {
    const accessToken = this.config.get<string>('mercadopago.accessToken');
    if (accessToken) {
      const client = new MercadoPagoConfig({
        accessToken,
        options: { timeout: 5000 },
      });
      this.preference = new Preference(client);
    }
  }

  /**
   * Crea una preferencia (Checkout Pro) a partir del carrito actual.
   * Devuelve init_point para redirigir al usuario a Mercado Pago.
   */
  async createPreference(
    identifier: string,
    payer?: { email?: string; name?: string; surname?: string },
    externalReference?: string,
  ): Promise<{ init_point: string; preference_id: string; sandbox_init_point?: string }> {
    if (!this.preference) {
      throw new BadRequestException(
        'Mercado Pago no está configurado. Añade MERCADOPAGO_ACCESS_TOKEN en .env',
      );
    }

    const cart = await this.cartService.getCart(identifier);
    if (!cart.items?.length) {
      throw new BadRequestException('El carrito está vacío');
    }

    const items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productsService.findOne(item.productId) as ProductDocument | null;
        if (!product) {
          throw new BadRequestException(`Producto no encontrado: ${item.productId}`);
        }
        return {
          id: product._id.toString(),
          title: product.name,
          description: product.description?.slice(0, 255) || product.name,
          picture_url: product.image,
          quantity: item.quantity,
          unit_price: Number(product.price),
          currency_id: 'ARS',
        };
      }),
    );

    const successUrl = this.config.get<string>('mercadopago.successUrl');
    const failureUrl = this.config.get<string>('mercadopago.failureUrl');
    const pendingUrl = this.config.get<string>('mercadopago.pendingUrl');
    const webhookUrl = this.config.get<string>('mercadopago.webhookUrl');

    const body = {
      items,
      payer:
        payer?.email || payer?.name || payer?.surname
          ? {
              email: payer.email,
              name: payer.name,
              surname: payer.surname,
            }
          : undefined,
      external_reference: externalReference || `cart_${identifier}`,
      auto_return: 'approved' as const,
      redirect_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      notification_url: webhookUrl || undefined,
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
    };

    const response = await this.preference.create({ body });
    return {
      init_point: response.init_point!,
      preference_id: response.id!,
      sandbox_init_point: response.sandbox_init_point,
    };
  }
}
