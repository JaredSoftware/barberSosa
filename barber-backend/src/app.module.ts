import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { RedisModule } from './redis/redis.module';
import { CartModule } from './cart/cart.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { AppointmentsController } from './appointments/appointments.controller';
import { ConfigurationModule } from './configuration/configuration.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongodbUri'),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    AuthModule,
    UsersModule,
    OffersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    AppointmentsModule,
    ConfigurationModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes(AppointmentsController);
  }
}
