import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import type { RequestWithSession } from './session.middleware';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /** Carrito vacío cuando no hay sesión (evita 400 y retrasos en carga inicial) */
  private emptyCart = () => ({ items: [], updatedAt: new Date() });

  /**
   * Obtener carrito actual
   * Público (usa sessionId o userId si está autenticado).
   * Sin sesión devuelve 200 y carrito vacío para no bloquear la carga del frontend.
   */
  @Get()
  async getCart(@Req() req: RequestWithSession) {
    const identifier = req.userId || req.sessionId;
    if (!identifier) {
      return this.emptyCart();
    }
    return this.cartService.getCart(identifier);
  }

  /**
   * Añadir producto al carrito
   * Público. Sin sesión devuelve carrito vacío (evita 400).
   */
  @Post('items')
  async addToCart(@Body() dto: AddToCartDto, @Req() req: RequestWithSession) {
    const identifier = req.userId || req.sessionId;
    if (!identifier) {
      return this.emptyCart();
    }
    return this.cartService.addToCart(identifier, dto.productId, dto.quantity);
  }

  /**
   * Actualizar cantidad de un producto
   * Público. Sin sesión devuelve carrito vacío (evita 400).
   */
  @Patch('items/:productId')
  async updateCartItem(
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
    @Req() req: RequestWithSession,
  ) {
    const identifier = req.userId || req.sessionId;
    if (!identifier) {
      return this.emptyCart();
    }
    return this.cartService.updateCartItem(identifier, productId, dto.quantity);
  }

  /**
   * Eliminar producto del carrito
   * Público. Sin sesión devuelve carrito vacío (evita 400).
   */
  @Delete('items/:productId')
  async removeFromCart(
    @Param('productId') productId: string,
    @Req() req: RequestWithSession,
  ) {
    const identifier = req.userId || req.sessionId;
    if (!identifier) {
      return this.emptyCart();
    }
    return this.cartService.removeFromCart(identifier, productId);
  }

  /**
   * Limpiar todo el carrito
   * Público. Sin sesión responde OK sin error (evita 400).
   */
  @Delete()
  async clearCart(@Req() req: RequestWithSession) {
    const identifier = req.userId || req.sessionId;
    if (!identifier) {
      return { message: 'Carrito vaciado' };
    }
    await this.cartService.clearCart(identifier);
    return { message: 'Carrito vaciado' };
  }

  /**
   * Fusionar carrito de invitado con carrito de usuario
   * Requiere autenticación
   */
  @Post('merge')
  @UseGuards(JwtAuthGuard)
  async mergeCart(@Req() req: RequestWithSession) {
    if (!req.userId || !req.sessionId) {
      throw new BadRequestException('Usuario no autenticado o sesión inválida');
    }

    return this.cartService.mergeCart(req.sessionId, req.userId);
  }
}
