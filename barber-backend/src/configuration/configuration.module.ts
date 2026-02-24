import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopConfig, ShopConfigSchema } from './schemas/shop-config.schema';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShopConfig.name, schema: ShopConfigSchema },
    ]),
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
