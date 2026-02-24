import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { Cart, CartItem } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  /**
   * Obtener carrito por sessionId o userId
   */
  async getCart(identifier: string): Promise<Cart> {
    const key = `cart:${identifier}`;
    const data = await this.redis.get(key);
    
    if (!data) {
      return { items: [], updatedAt: new Date() };
    }
    
    const cart = JSON.parse(data);
    // Convertir las fechas de string a Date
    cart.updatedAt = new Date(cart.updatedAt);
    cart.items = cart.items.map((item: any) => ({
      ...item,
      addedAt: new Date(item.addedAt),
    }));
    
    return cart;
  }

  /**
   * Añadir o actualizar producto en el carrito
   */
  async addToCart(
    identifier: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getCart(identifier);
    
    const existingItem = cart.items.find((item) => item.productId === productId);
    
    if (existingItem) {
      // Actualizar cantidad
      existingItem.quantity += quantity;
      if (existingItem.quantity <= 0) {
        // Si la cantidad es 0 o negativa, eliminar el item
        cart.items = cart.items.filter((item) => item.productId !== productId);
      }
    } else if (quantity > 0) {
      // Añadir nuevo item
      cart.items.push({
        productId,
        quantity,
        addedAt: new Date(),
      });
    }
    
    cart.updatedAt = new Date();
    
    await this.saveCart(identifier, cart);
    return cart;
  }

  /**
   * Actualizar cantidad de un producto
   */
  async updateCartItem(
    identifier: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getCart(identifier);
    
    if (quantity <= 0) {
      // Eliminar item si la cantidad es 0 o negativa
      cart.items = cart.items.filter((item) => item.productId !== productId);
    } else {
      const item = cart.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
    
    cart.updatedAt = new Date();
    
    await this.saveCart(identifier, cart);
    return cart;
  }

  /**
   * Eliminar producto del carrito
   */
  async removeFromCart(identifier: string, productId: string): Promise<Cart> {
    const cart = await this.getCart(identifier);
    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.updatedAt = new Date();
    
    await this.saveCart(identifier, cart);
    return cart;
  }

  /**
   * Limpiar todo el carrito
   */
  async clearCart(identifier: string): Promise<void> {
    const key = `cart:${identifier}`;
    await this.redis.del(key);
  }

  /**
   * Fusionar carrito de invitado con carrito de usuario autenticado
   */
  async mergeCart(sessionId: string, userId: string): Promise<Cart> {
    const sessionCart = await this.getCart(sessionId);
    const userCart = await this.getCart(userId);
    
    // Fusionar items: si hay conflictos, sumar las cantidades
    for (const sessionItem of sessionCart.items) {
      const userItem = userCart.items.find(
        (item) => item.productId === sessionItem.productId,
      );
      
      if (userItem) {
        userItem.quantity += sessionItem.quantity;
      } else {
        userCart.items.push(sessionItem);
      }
    }
    
    userCart.updatedAt = new Date();
    
    // Guardar el carrito fusionado en el userId
    await this.saveCart(userId, userCart);
    
    // Eliminar el carrito de sesión
    await this.clearCart(sessionId);
    
    return userCart;
  }

  /**
   * Guardar carrito en Redis con TTL de 30 días
   */
  private async saveCart(identifier: string, cart: Cart): Promise<void> {
    const key = `cart:${identifier}`;
    const ttl = 30 * 24 * 60 * 60; // 30 días en segundos
    
    await this.redis.setex(key, ttl, JSON.stringify(cart));
  }
}
