import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { SessionMiddleware } from '../cart/session.middleware';
import { MercadoPagoService } from './mercadopago.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [CartModule, ProductsModule],
  controllers: [PaymentController],
  providers: [MercadoPagoService],
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(PaymentController);
  }
}
