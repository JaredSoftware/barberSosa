import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { SessionMiddleware } from './session.middleware';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(CartController);
  }
}
